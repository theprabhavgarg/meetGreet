import mongoose, { Schema, Document } from 'mongoose'
import { User as IUser } from '@/types'

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  profile: {
    fullName: { type: String, required: true },
    firstName: String,
    lastName: String,
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
      required: true
    },
    city: { type: String, required: true },
    bio: { type: String, required: true },
    images: [{ type: String }],
    phoneNumber: { type: String, required: true },
    
    educationLevel: { type: String, required: true },
    educationInstitute: { type: String, required: true },
    
    currentOrganization: { type: String, required: true },
    currentDesignation: { type: String, required: true },
    
    hideFirstName: { type: Boolean, default: false },
    hideCurrentCompany: { type: Boolean, default: false },
    
    relationshipStatus: {
      type: String,
      enum: ['single', 'in-relationship', 'married', 'prefer-not-to-say'],
      required: true
    },
    
    interests: [{ type: String }]
  },
  
  verification: {
    mobileVerified: { type: Boolean, default: false },
    mobileOTP: String,
    mobileOTPExpiry: Date,
    
    emailVerified: { type: Boolean, default: false },
    emailOTP: String,
    emailOTPExpiry: Date,
    
    officialEmailVerified: { type: Boolean, default: false },
    officialEmail: String,
    
    linkedInVerified: { type: Boolean, default: false },
    linkedInId: String,
    
    isFullyVerified: { type: Boolean, default: false }
  },
  
  preferences: {
    primaryObjective: [{
      type: String,
      enum: ['networking', 'casual-hangouts', 'chat-connect', 'gain-knowledge']
    }],
    cities: [{ type: String }],
    meetupLocations: [{ type: String }],
    preferredMeetupTimes: [{ type: String }],
    personalityAnswers: [{
      questionId: String,
      answer: String,
      points: Number
    }],
    interestedPersonalityTypes: [{ type: String }],
    matchScore: { type: Number, default: 0 }
  },
  
  stats: {
    totalMatches: { type: Number, default: 0 },
    totalMeetups: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratings: [{
      fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      funToTalkTo: Number,
      safety: Number,
      wellSpoken: Number,
      knowledge: Number,
      professionalBehavior: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }],
    safetyConcerns: { type: Number, default: 0 },
    superPushStarsAvailable: { type: Number, default: 2 },
    superPushStarsUsed: { type: Number, default: 0 },
    reportsReceived: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false },
    blockedReason: String
  },
  
  subscription: {
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ 'profile.city': 1 })
UserSchema.index({ 'verification.isFullyVerified': 1 })
UserSchema.index({ 'stats.blocked': 1 })
UserSchema.index({ 'preferences.matchScore': -1 })

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)

