import mongoose, { Schema, Document } from 'mongoose'
import { Match as IMatch } from '@/types'

export interface MatchDocument extends Omit<IMatch, '_id'>, Document {}

const MatchSchema = new Schema<MatchDocument>({
  user1Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user1Status: {
    type: String,
    enum: ['interested', 'super-push', 'declined', 'matched'],
    default: 'interested'
  },
  user2Status: {
    type: String,
    enum: ['interested', 'super-push', 'declined', 'matched'],
    default: 'interested'
  },
  matchScore: { type: Number, required: true },
  isMatched: { type: Boolean, default: false },
  declinedUntil: Date
}, {
  timestamps: true
})

// Compound index to prevent duplicate matches
MatchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true })
MatchSchema.index({ user1Id: 1, isMatched: 1 })
MatchSchema.index({ user2Id: 1, isMatched: 1 })

export default mongoose.models.Match || mongoose.model<MatchDocument>('Match', MatchSchema)

