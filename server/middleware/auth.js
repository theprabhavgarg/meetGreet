const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Verify JWT token for users
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -otpData');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Verify admin token
exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if profile is complete and verified
exports.checkProfileComplete = async (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({ error: 'Please complete your profile first' });
  }
  
  // Skip verification check in development mode
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  if (!req.user.isPhoneVerified || !req.user.isEmailVerified || !req.user.isLinkedInVerified) {
    return res.status(403).json({ error: 'Please complete all verifications' });
  }
  
  next();
};

// Check admin permissions
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.admin.role === 'super-admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};



