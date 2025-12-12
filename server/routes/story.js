const express = require('express');
const router = express.Router();
const multer = require('multer');
const Story = require('../models/Story');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Configure multer
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Create story
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { content, taggedUsers, meetupId, visibility } = req.body;
    
    // Upload images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.path);
        imageUrls.push(url);
      }
    }
    
    const story = new Story({
      author: req.user._id,
      content,
      images: imageUrls,
      taggedUsers: taggedUsers ? JSON.parse(taggedUsers) : [],
      meetup: meetupId,
      visibility: visibility || 'public'
    });
    
    await story.save();
    
    res.json({ 
      message: 'Story created successfully',
      story 
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Get stories (feed)
router.get('/feed', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const stories = await Story.find({
      $or: [
        { visibility: 'public' },
        { 
          visibility: 'connections',
          $or: [
            { author: { $in: req.user.matches } },
            { taggedUsers: req.user._id }
          ]
        }
      ]
    })
    .populate('author', 'fullName profileImage')
    .populate('taggedUsers', 'fullName profileImage')
    .populate('meetup')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
    
    res.json({ stories });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get user's stories
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({ author: req.params.userId })
      .populate('author', 'fullName profileImage')
      .populate('taggedUsers', 'fullName profileImage')
      .sort({ createdAt: -1 });
    
    res.json({ stories });
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Like story
router.post('/:storyId/like', verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    const isLiked = story.likes.includes(req.user._id);
    
    if (isLiked) {
      // Unlike
      story.likes = story.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Like
      story.likes.push(req.user._id);
    }
    
    await story.save();
    
    res.json({ 
      message: isLiked ? 'Story unliked' : 'Story liked',
      likesCount: story.likes.length
    });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ error: 'Failed to like story' });
  }
});

// Comment on story
router.post('/:storyId/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    story.comments.push({
      user: req.user._id,
      text
    });
    
    await story.save();
    await story.populate('comments.user', 'fullName profileImage');
    
    res.json({ 
      message: 'Comment added',
      comment: story.comments[story.comments.length - 1]
    });
  } catch (error) {
    console.error('Comment on story error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Share story on social media (grants reward stars)
router.post('/:storyId/share', verifyToken, async (req, res) => {
  try {
    const { platform } = req.body; // 'linkedin' or 'social'
    
    const story = await Story.findById(req.params.storyId);
    const user = await User.findById(req.user._id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Grant reward stars if not already granted
    if (!story.rewardStarsGranted) {
      user.purchasedStars += 5; // Bonus stars for sharing
      story.rewardStarsGranted = true;
      
      if (platform === 'linkedin') {
        story.sharedOnLinkedIn = true;
      } else {
        story.sharedOnSocialMedia = true;
      }
      
      await user.save();
      await story.save();
      
      res.json({ 
        message: 'Story shared! You earned 5 bonus stars',
        bonusStars: 5,
        totalStars: user.dailyStars.count + user.purchasedStars
      });
    } else {
      res.json({ message: 'Story shared' });
    }
  } catch (error) {
    console.error('Share story error:', error);
    res.status(500).json({ error: 'Failed to share story' });
  }
});

// Delete story
router.delete('/:storyId', verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Verify author
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Story.findByIdAndDelete(req.params.storyId);
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

module.exports = router;



