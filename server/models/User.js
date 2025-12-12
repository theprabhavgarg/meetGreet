const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Profile Information
  profileImage: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  city: {
    type: String
  },
  
  // Education
  educationLevel: {
    type: String,
    enum: ['high-school', 'undergraduate', 'graduate', 'postgraduate', 'doctorate', 'other']
  },
  educationInstitute: {
    type: String
  },
  
  // Professional
  currentOrganization: {
    type: String
  },
  currentDesignation: {
    type: String
  },
  
  // Verification Status
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isLinkedInVerified: {
    type: Boolean,
    default: false
  },
  linkedInProfile: {
    type: String
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isProfileActive: {
    type: Boolean,
    default: false
  },
  
  // Privacy Settings
  hiddenFields: [{
    type: String,
    enum: ['fullName', 'currentOrganization', 'currentDesignation', 'phoneNumber']
  }],
  
  // Personality Assessment (10 questions)
  personalityAnswers: [{
    questionId: String,
    answer: String
  }],
  personalityScore: {
    type: Number,
    default: 0
  },
  
  // Personality Preferences (5 questions)
  personalityPreferences: [{
    questionId: String,
    answer: String
  }],
  
  // Primary Objective
  primaryObjective: {
    type: String,
    enum: ['networking', 'casual-hangouts', 'chat-connect', 'gain-knowledge'],
    required: true
  },
  
  // Location Preferences
  preferredCities: [{
    type: String
  }],
  preferredMeetupLocations: [{
    city: String,
    locations: [String]
  }],
  
  // Matching Score Components
  matchingScore: {
    locationWeight: { type: Number, default: 0 },
    personalityWeight: { type: Number, default: 0 },
    selfAssessmentWeight: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }
  },
  
  // Safety & Rating
  safetyScore: {
    type: Number,
    default: 100
  },
  ratings: {
    funToTalkTo: { type: Number, default: 0 },
    safetyConcerns: { type: Number, default: 0 },
    wellSpoken: { type: Number, default: 0 },
    knowledge: { type: Number, default: 0 },
    professionalBehaviour: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  safetyReports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    date: { type: Date, default: Date.now }
  }],
  
  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'blocked', 'paused'],
    default: 'active'
  },
  blockReason: String,
  
  // Swipe History
  rightSwipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  leftSwipes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    declinedAt: { type: Date, default: Date.now }
  }],
  permanentDeclines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Super Push Stars
  dailyStars: {
    count: { type: Number, default: 2 },
    lastResetDate: { type: Date, default: Date.now }
  },
  purchasedStars: {
    type: Number,
    default: 0
  },
  superPushSent: [{
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  superPushReceived: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  
  // Subscription & Revenue
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    startDate: Date,
    expiryDate: Date,
    freeTrialUsed: { type: Boolean, default: false }
  },
  
  // Referrals
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referrals: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rewardClaimed: { type: Boolean, default: false }
  }],
  referralRewards: {
    cash: { type: Number, default: 0 },
    stars: { type: Number, default: 0 }
  },
  
  // Matches
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Last Active
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // OTP Storage (temporary)
  otpData: {
    phoneOTP: String,
    emailOTP: String,
    phoneOTPExpiry: Date,
    emailOTPExpiry: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate age
userSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Reset daily stars
userSchema.methods.resetDailyStars = function() {
  const now = new Date();
  const lastReset = new Date(this.dailyStars.lastResetDate);
  
  if (now.toDateString() !== lastReset.toDateString()) {
    this.dailyStars.count = 2;
    this.dailyStars.lastResetDate = now;
  }
};

module.exports = mongoose.model('User', userSchema);

