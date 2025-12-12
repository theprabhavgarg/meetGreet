const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { calculateMatchScore } = require('../utils/matching');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Complete profile - Step 2
router.put('/complete-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      city,
      educationLevel,
      educationInstitute,
      currentOrganization,
      currentDesignation,
      bio,
      hiddenFields,
      primaryObjective
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Upload profile image to Cloudinary
    let profileImageUrl = user.profileImage;
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.path);
    }
    
    // Update user profile
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.city = city;
    user.educationLevel = educationLevel;
    user.educationInstitute = educationInstitute;
    user.currentOrganization = currentOrganization;
    user.currentDesignation = currentDesignation;
    user.bio = bio;
    user.profileImage = profileImageUrl;
    user.primaryObjective = primaryObjective;
    
    if (hiddenFields) {
      user.hiddenFields = JSON.parse(hiddenFields);
    }
    
    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        profileImage: user.profileImage,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Save personality assessment - Step 3
router.post('/personality-assessment', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const user = await User.findById(req.user._id);
    user.personalityAnswers = answers;
    
    // Calculate personality score (simple implementation)
    user.personalityScore = answers.length * 5; // Each answer worth 5 points
    
    await user.save();
    
    res.json({ message: 'Personality assessment saved' });
  } catch (error) {
    console.error('Personality assessment error:', error);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Save personality preferences - Step 4
router.post('/personality-preferences', verifyToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    user.personalityPreferences = preferences;
    
    await user.save();
    
    res.json({ message: 'Personality preferences saved' });
  } catch (error) {
    console.error('Personality preferences error:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// Save location preferences - Step 5
router.post('/location-preferences', verifyToken, async (req, res) => {
  try {
    const { preferredCities, preferredMeetupLocations } = req.body;
    
    const user = await User.findById(req.user._id);
    user.preferredCities = preferredCities;
    user.preferredMeetupLocations = preferredMeetupLocations;
    
    // Calculate matching score
    const matchScore = calculateMatchScore(user);
    user.matchingScore = matchScore;
    
    // Mark profile as complete and active
    user.isProfileComplete = true;
    
    // Check if all verifications are done
    if (user.isPhoneVerified && user.isEmailVerified && user.isLinkedInVerified) {
      user.isProfileActive = true;
    }
    
    await user.save();
    
    res.json({ 
      message: 'Preferences saved. Profile setup complete!',
      isActive: user.isProfileActive
    });
  } catch (error) {
    console.error('Location preferences error:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -otpData')
      .populate('matches', 'fullName profileImage')
      .populate('referredBy', 'fullName username');
    
    // Reset daily stars if needed
    user.resetDailyStars();
    await user.save();
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    // Upload new profile image if provided
    if (req.file) {
      updates.profileImage = await uploadToCloudinary(req.file.path);
    }
    
    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.phoneNumber;
    delete updates.isPhoneVerified;
    delete updates.isEmailVerified;
    delete updates.isLinkedInVerified;
    
    Object.assign(user, updates);
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get another user's profile (for matching)
router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -otpData -rightSwipes -leftSwipes -permanentDeclines');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Filter hidden fields
    const profile = user.toObject();
    if (user.hiddenFields && user.hiddenFields.length > 0) {
      user.hiddenFields.forEach(field => {
        if (profile[field]) {
          profile[field] = '[Hidden]';
        }
      });
    }
    
    res.json({ user: profile });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Delete account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;



