const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../utils/otp');
const { verifyLinkedIn } = require('../utils/linkedin');

// Generate referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register - Step 1: Basic Information
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, fullName, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }, { phoneNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email, username, or phone number' 
      });
    }
    
    // Create user with basic info
    const user = new User({
      email,
      password,
      username,
      fullName,
      phoneNumber,
      referralCode: generateReferralCode(),
      primaryObjective: 'networking' // default
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Registration initiated. Please complete your profile.',
      token,
      userId: user._id,
      step: 'profile-completion'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ error: 'Account is suspended or blocked' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        profileImage: user.profileImage,
        isProfileComplete: user.isProfileComplete,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        isLinkedInVerified: user.isLinkedInVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Send Phone OTP
router.post('/send-phone-otp', async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const otp = await sendOTP(phoneNumber, 'phone');
    
    // Store OTP (in production, use Redis or encrypted storage)
    user.otpData = {
      ...user.otpData,
      phoneOTP: otp,
      phoneOTPExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    await user.save();
    
    res.json({ message: 'OTP sent to phone number' });
  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify Phone OTP
router.post('/verify-phone-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.otpData || !user.otpData.phoneOTP) {
      return res.status(400).json({ error: 'OTP not sent' });
    }
    
    if (new Date() > user.otpData.phoneOTPExpiry) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    
    if (user.otpData.phoneOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    user.isPhoneVerified = true;
    user.otpData.phoneOTP = undefined;
    user.otpData.phoneOTPExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Send Email OTP
router.post('/send-email-otp', async (req, res) => {
  try {
    const { userId, email } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const otp = await sendOTP(email, 'email');
    
    user.otpData = {
      ...user.otpData,
      emailOTP: otp,
      emailOTPExpiry: new Date(Date.now() + 10 * 60 * 1000)
    };
    await user.save();
    
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify Email OTP
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.otpData || !user.otpData.emailOTP) {
      return res.status(400).json({ error: 'OTP not sent' });
    }
    
    if (new Date() > user.otpData.emailOTPExpiry) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    
    if (user.otpData.emailOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    user.isEmailVerified = true;
    user.otpData.emailOTP = undefined;
    user.otpData.emailOTPExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// LinkedIn OAuth callback
router.post('/verify-linkedin', async (req, res) => {
  try {
    const { userId, linkedInCode } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify LinkedIn (implement OAuth flow)
    const linkedInProfile = await verifyLinkedIn(linkedInCode);
    
    user.isLinkedInVerified = true;
    user.linkedInProfile = linkedInProfile.profileUrl;
    await user.save();
    
    res.json({ message: 'LinkedIn verified successfully' });
  } catch (error) {
    console.error('LinkedIn verification error:', error);
    res.status(500).json({ error: 'LinkedIn verification failed' });
  }
});

// Verify Referral Code
router.post('/verify-referral', async (req, res) => {
  try {
    const { userId, referralCode } = req.body;
    
    const user = await User.findById(userId);
    const referrer = await User.findOne({ referralCode });
    
    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }
    
    if (user.referredBy) {
      return res.status(400).json({ error: 'Referral already applied' });
    }
    
    user.referredBy = referrer._id;
    await user.save();
    
    // Add to referrer's referrals
    referrer.referrals.push({
      user: user._id,
      rewardClaimed: false
    });
    await referrer.save();
    
    res.json({ message: 'Referral code applied successfully' });
  } catch (error) {
    console.error('Referral verification error:', error);
    res.status(500).json({ error: 'Referral verification failed' });
  }
});

module.exports = router;



