const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Chat = require('../models/Chat');
const { verifyToken, checkProfileComplete } = require('../middleware/auth');
const { findPotentialMatches, calculateCompatibilityScore } = require('../utils/matching');

// Get potential matches (cards to swipe)
router.get('/potential', verifyToken, checkProfileComplete, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { limit = 20 } = req.query;
    
    // Find potential matches based on preferences
    const potentialMatches = await findPotentialMatches(currentUser, parseInt(limit));
    
    res.json({ matches: potentialMatches });
  } catch (error) {
    console.error('Get potential matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Right swipe (show interest)
router.post('/swipe-right/:targetUserId', verifyToken, checkProfileComplete, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already swiped
    if (currentUser.rightSwipes.includes(targetUser._id)) {
      return res.status(400).json({ error: 'Already showed interest' });
    }
    
    // Add to right swipes
    currentUser.rightSwipes.push(targetUser._id);
    await currentUser.save();
    
    // Check if it's a match (both swiped right)
    const isMatch = targetUser.rightSwipes.includes(currentUser._id);
    
    if (isMatch) {
      // Create match
      const matchScore = calculateCompatibilityScore(currentUser, targetUser);
      
      // Create chat
      const chat = new Chat({
        participants: [currentUser._id, targetUser._id]
      });
      await chat.save();
      
      const match = new Match({
        user1: currentUser._id,
        user2: targetUser._id,
        matchScore,
        chatId: chat._id
      });
      await match.save();
      
      // Add to both users' matches
      currentUser.matches.push(targetUser._id);
      targetUser.matches.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
      
      // Notify via socket if available
      const io = req.app.get('io');
      if (io) {
        io.emit('new-match', {
          userId1: currentUser._id,
          userId2: targetUser._id,
          matchId: match._id
        });
      }
      
      res.json({ 
        message: 'It\'s a match!', 
        isMatch: true,
        match: {
          id: match._id,
          user: {
            id: targetUser._id,
            fullName: targetUser.fullName,
            profileImage: targetUser.profileImage
          },
          chatId: chat._id
        }
      });
    } else {
      res.json({ message: 'Interest recorded', isMatch: false });
    }
  } catch (error) {
    console.error('Swipe right error:', error);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

// Left swipe (decline)
router.post('/swipe-left/:targetUserId', verifyToken, checkProfileComplete, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { permanent = false } = req.body;
    
    if (permanent) {
      // Permanent decline
      if (!currentUser.permanentDeclines.includes(req.params.targetUserId)) {
        currentUser.permanentDeclines.push(req.params.targetUserId);
      }
    } else {
      // Temporary decline (show again after 15 days)
      currentUser.leftSwipes.push({
        user: req.params.targetUserId,
        declinedAt: new Date()
      });
    }
    
    await currentUser.save();
    
    res.json({ message: 'Profile declined' });
  } catch (error) {
    console.error('Swipe left error:', error);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

// Send super push star
router.post('/super-push/:targetUserId', verifyToken, checkProfileComplete, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Reset daily stars if needed
    currentUser.resetDailyStars();
    
    // Check if user has stars available
    const totalStars = currentUser.dailyStars.count + currentUser.purchasedStars;
    
    if (totalStars <= 0) {
      return res.status(400).json({ error: 'No stars available' });
    }
    
    // Use stars (daily first, then purchased)
    if (currentUser.dailyStars.count > 0) {
      currentUser.dailyStars.count--;
    } else {
      currentUser.purchasedStars--;
    }
    
    // Add super push
    currentUser.superPushSent.push({
      to: targetUser._id,
      date: new Date()
    });
    
    targetUser.superPushReceived.push({
      from: currentUser._id,
      date: new Date()
    });
    
    // Also add to right swipes
    if (!currentUser.rightSwipes.includes(targetUser._id)) {
      currentUser.rightSwipes.push(targetUser._id);
    }
    
    await currentUser.save();
    await targetUser.save();
    
    // Check for match
    const isMatch = targetUser.rightSwipes.includes(currentUser._id);
    
    if (isMatch) {
      const matchScore = calculateCompatibilityScore(currentUser, targetUser);
      
      const chat = new Chat({
        participants: [currentUser._id, targetUser._id]
      });
      await chat.save();
      
      const match = new Match({
        user1: currentUser._id,
        user2: targetUser._id,
        matchScore,
        chatId: chat._id,
        superPushUsed: true,
        superPushBy: currentUser._id
      });
      await match.save();
      
      currentUser.matches.push(targetUser._id);
      targetUser.matches.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
      
      res.json({ 
        message: 'It\'s a match with super push!', 
        isMatch: true,
        match: {
          id: match._id,
          chatId: chat._id
        }
      });
    } else {
      // Notify target user about super push
      const io = req.app.get('io');
      if (io) {
        io.emit('super-push-received', {
          userId: targetUser._id,
          from: {
            id: currentUser._id,
            fullName: currentUser.fullName,
            profileImage: currentUser.profileImage
          }
        });
      }
      
      res.json({ 
        message: 'Super push sent!', 
        isMatch: false,
        remainingStars: currentUser.dailyStars.count + currentUser.purchasedStars
      });
    }
  } catch (error) {
    console.error('Super push error:', error);
    res.status(500).json({ error: 'Failed to send super push' });
  }
});

// Get declined profiles
router.get('/declined', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate('leftSwipes.user', 'fullName profileImage currentDesignation')
      .populate('permanentDeclines', 'fullName profileImage currentDesignation');
    
    res.json({
      temporary: currentUser.leftSwipes,
      permanent: currentUser.permanentDeclines
    });
  } catch (error) {
    console.error('Get declined profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch declined profiles' });
  }
});

// Undo decline (accept previously declined profile)
router.post('/undo-decline/:targetUserId', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Remove from left swipes
    currentUser.leftSwipes = currentUser.leftSwipes.filter(
      swipe => swipe.user.toString() !== req.params.targetUserId
    );
    
    // Remove from permanent declines
    currentUser.permanentDeclines = currentUser.permanentDeclines.filter(
      id => id.toString() !== req.params.targetUserId
    );
    
    await currentUser.save();
    
    res.json({ message: 'Decline undone' });
  } catch (error) {
    console.error('Undo decline error:', error);
    res.status(500).json({ error: 'Failed to undo decline' });
  }
});

// Get all matches
router.get('/my-matches', verifyToken, checkProfileComplete, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ],
      status: 'active'
    })
    .populate('user1', 'fullName profileImage currentDesignation city')
    .populate('user2', 'fullName profileImage currentDesignation city')
    .populate('chatId')
    .sort({ matchedAt: -1 });
    
    // Format matches to show the other user
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1._id.toString() === req.user._id.toString() 
        ? match.user2 
        : match.user1;
      
      return {
        id: match._id,
        user: otherUser,
        matchScore: match.matchScore,
        matchedAt: match.matchedAt,
        chatId: match.chatId?._id,
        hasUnreadMessages: match.chatId?.messages?.some(
          msg => !msg.readBy.includes(req.user._id)
        ) || false
      };
    });
    
    res.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Unmatch
router.delete('/unmatch/:matchId', verifyToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Verify user is part of the match
    if (match.user1.toString() !== req.user._id.toString() && 
        match.user2.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    match.status = 'unmatched';
    await match.save();
    
    res.json({ message: 'Unmatched successfully' });
  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ error: 'Failed to unmatch' });
  }
});

module.exports = router;



