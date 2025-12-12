const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  location: {
    venue: {
      type: String,
      required: true
    },
    address: String,
    city: String,
    isAppRecommended: {
      type: Boolean,
      default: false
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner'
    }
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Post-meetup ratings
  ratings: [{
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ratedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    funToTalkTo: {
      type: Number,
      min: 1,
      max: 5
    },
    safetyConcerns: {
      type: Number,
      min: 1,
      max: 5
    },
    wellSpoken: {
      type: Number,
      min: 1,
      max: 5
    },
    knowledge: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalBehaviour: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Bill splitting
  billSplit: {
    totalAmount: Number,
    splits: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      isPaid: {
        type: Boolean,
        default: false
      }
    }],
    discount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meetup', meetupSchema);



