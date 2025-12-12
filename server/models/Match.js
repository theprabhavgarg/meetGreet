const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchScore: {
    type: Number,
    default: 0
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  status: {
    type: String,
    enum: ['active', 'unmatched', 'blocked'],
    default: 'active'
  },
  // Track if super push star was used
  superPushUsed: {
    type: Boolean,
    default: false
  },
  superPushBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate matches
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);



