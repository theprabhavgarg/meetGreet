const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['restaurant', 'cafe', 'bar', 'activity-zone', 'coworking', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
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
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [{
    type: String
  }],
  description: String,
  amenities: [String],
  // Discount & Offers
  discount: {
    percentage: Number,
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Partnership details
  commissionRate: {
    type: Number,
    default: 0
  },
  contractStartDate: Date,
  contractEndDate: Date
}, {
  timestamps: true
});

// Index for geospatial queries
partnerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Partner', partnerSchema);



