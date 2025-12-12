const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meetup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetup'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in-progress', 'resolved', 'false-alarm'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  resolvedAt: Date,
  notes: [{
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  actionsTaken: [String],
  // Emergency contacts notified
  contactsNotified: [{
    name: String,
    phone: String,
    relation: String,
    notifiedAt: Date
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
sosSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS', sosSchema);



