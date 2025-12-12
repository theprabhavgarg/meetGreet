const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  taggedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  meetup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetup'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  sharedOnLinkedIn: {
    type: Boolean,
    default: false
  },
  sharedOnSocialMedia: {
    type: Boolean,
    default: false
  },
  rewardStarsGranted: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);



