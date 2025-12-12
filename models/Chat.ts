import mongoose, { Schema, Document } from 'mongoose'
import { Chat as IChat } from '@/types'

export interface ChatDocument extends Omit<IChat, '_id'>, Document {}

const ChatSchema = new Schema<ChatDocument>({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'meetup-request', 'system'],
      default: 'text'
    },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  meetup: {
    location: String,
    venueId: { type: Schema.Types.ObjectId, ref: 'Venue' },
    dateTime: Date,
    status: {
      type: String,
      enum: ['proposed', 'confirmed', 'completed', 'cancelled']
    },
    proposedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    confirmedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date
  }
}, {
  timestamps: true
})

ChatSchema.index({ matchId: 1 })
ChatSchema.index({ participants: 1 })

export default mongoose.models.Chat || mongoose.model<ChatDocument>('Chat', ChatSchema)

