const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const Partner = require('../models/Partner');
const Match = require('../models/Match');
const Meetup = require('../models/Meetup');
const { verifyAdmin, checkPermission } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    admin.lastLogin = new Date();
    await admin.save();
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all users (with filters)
router.get('/users', verifyAdmin, checkPermission('user-management'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      city,
      verified,
      search 
    } = req.query;
    
    let query = {};
    
    if (status) {
      query.accountStatus = status;
    }
    
    if (city) {
      query.city = city;
    }
    
    if (verified === 'true') {
      query.isPhoneVerified = true;
      query.isEmailVerified = true;
      query.isLinkedInVerified = true;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password -otpData')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({ 
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:userId', verifyAdmin, checkPermission('user-management'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -otpData')
      .populate('matches', 'fullName profileImage')
      .populate('referredBy', 'fullName username');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's meetup history
    const meetups = await Meetup.find({ participants: user._id })
      .populate('participants', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ user, meetups });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user status
router.put('/users/:userId/status', verifyAdmin, checkPermission('user-management'), async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.accountStatus = status;
    
    if (status === 'blocked' || status === 'suspended') {
      user.blockReason = reason;
    }
    
    await user.save();
    
    res.json({ message: `User ${status} successfully`, user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
router.delete('/users/:userId', verifyAdmin, checkPermission('user-management'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Send notification to user
router.post('/users/:userId/notify', verifyAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;
    
    // In production, implement push notification service
    const io = req.app.get('io');
    if (io) {
      io.emit('admin-notification', {
        userId: req.params.userId,
        title,
        message
      });
    }
    
    res.json({ message: 'Notification sent' });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get analytics
router.get('/analytics', verifyAdmin, checkPermission('analytics'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ accountStatus: 'active' });
    const verifiedUsers = await User.countDocuments({ 
      isPhoneVerified: true,
      isEmailVerified: true,
      isLinkedInVerified: true 
    });
    
    const totalMatches = await Match.countDocuments({ status: 'active' });
    const totalMeetups = await Meetup.countDocuments();
    const completedMeetups = await Meetup.countDocuments({ status: 'completed' });
    
    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Top cities
    const topCities = await User.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      overview: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        totalMatches,
        totalMeetups,
        completedMeetups,
        newUsersLast30Days: newUsers
      },
      topCities
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Partner management - Add partner
router.post('/partners', verifyAdmin, checkPermission('partner-management'), async (req, res) => {
  try {
    const partnerData = req.body;
    
    const partner = new Partner(partnerData);
    await partner.save();
    
    res.json({ message: 'Partner added successfully', partner });
  } catch (error) {
    console.error('Add partner error:', error);
    res.status(500).json({ error: 'Failed to add partner' });
  }
});

// Get all partners
router.get('/partners', verifyAdmin, checkPermission('partner-management'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type, city, isActive } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (city) query['address.city'] = city;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const partners = await Partner.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Partner.countDocuments(query);
    
    res.json({
      partners,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Update partner
router.put('/partners/:partnerId', verifyAdmin, checkPermission('partner-management'), async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.partnerId,
      req.body,
      { new: true }
    );
    
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    
    res.json({ message: 'Partner updated successfully', partner });
  } catch (error) {
    console.error('Update partner error:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Delete partner
router.delete('/partners/:partnerId', verifyAdmin, checkPermission('partner-management'), async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.partnerId);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

module.exports = router;



