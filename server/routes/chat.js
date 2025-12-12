const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Match = require('../models/Match');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Check if chat is accessible (subscription check)
const checkChatAccess = async (chat, userId) => {
  const user = await User.findById(userId);
  
  // Check if free trial is still active (1 month)
  if (chat.isFreeTrialActive) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    if (chat.freeTrialStartDate > oneMonthAgo) {
      return { hasAccess: true, reason: 'free-trial' };
    } else {
      chat.isFreeTrialActive = false;
      await chat.save();
    }
  }
  
  // Check if user has premium subscription
  if (user.subscription.type === 'premium' && 
      user.subscription.expiryDate > new Date()) {
    return { hasAccess: true, reason: 'premium' };
  }
  
  return { hasAccess: false, reason: 'subscription-required' };
};

// Get all chats for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'fullName profileImage lastActive')
    .sort({ lastMessageAt: -1 });
    
    // Format chats
    const formattedChats = chats.map(chat => {
      const otherUser = chat.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );
      
      const unreadCount = chat.messages.filter(
        msg => msg.sender.toString() !== req.user._id.toString() &&
               !msg.readBy.includes(req.user._id)
      ).length;
      
      return {
        id: chat._id,
        otherUser: {
          id: otherUser._id,
          fullName: otherUser.fullName,
          profileImage: otherUser.profileImage,
          lastActive: otherUser.lastActive
        },
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount,
        isFreeTrialActive: chat.isFreeTrialActive
      };
    });
    
    res.json({ chats: formattedChats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'fullName profileImage')
      .populate('messages.sender', 'fullName profileImage');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Verify user is part of chat
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Check chat access
    const accessCheck = await checkChatAccess(chat, req.user._id);
    
    if (!accessCheck.hasAccess) {
      return res.status(403).json({ 
        error: 'Subscription required',
        reason: accessCheck.reason 
      });
    }
    
    // Mark messages as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user._id.toString() &&
          !message.readBy.includes(req.user._id)) {
        message.readBy.push(req.user._id);
      }
    });
    await chat.save();
    
    res.json({ 
      messages: chat.messages,
      chatAccess: accessCheck
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Verify user is part of chat
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Check chat access
    const accessCheck = await checkChatAccess(chat, req.user._id);
    
    if (!accessCheck.hasAccess) {
      return res.status(403).json({ 
        error: 'Subscription required',
        reason: accessCheck.reason 
      });
    }
    
    // Add message
    const message = {
      sender: req.user._id,
      content,
      readBy: [req.user._id]
    };
    
    chat.messages.push(message);
    chat.lastMessage = content.substring(0, 100);
    chat.lastMessageAt = new Date();
    await chat.save();
    
    // Populate sender info for response
    await chat.populate('messages.sender', 'fullName profileImage');
    const newMessage = chat.messages[chat.messages.length - 1];
    
    // Emit via socket
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.chatId).emit('receive-message', {
        chatId: req.params.chatId,
        message: newMessage
      });
    }
    
    res.json({ message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete chat
router.delete('/:chatId', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Verify user is part of chat
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Find and update match status
    await Match.findOneAndUpdate(
      { chatId: chat._id },
      { status: 'unmatched' }
    );
    
    await Chat.findByIdAndDelete(req.params.chatId);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;



