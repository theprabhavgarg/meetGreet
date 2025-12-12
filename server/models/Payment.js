const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['subscription', 'stars-purchase', 'bill-split', 'referral-reward'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'wallet', 'netbanking']
  },
  transactionId: String,
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal']
  },
  // For subscription payments
  subscription: {
    plan: {
      type: String,
      enum: ['premium-monthly', 'premium-yearly']
    },
    startDate: Date,
    endDate: Date
  },
  // For stars purchase
  starsPurchased: Number,
  // For bill split
  meetup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetup'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);



