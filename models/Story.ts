import mongoose, { Schema, Document } from 'mongoose'
import { Story as IStory } from '@/types'

export interface StoryDocument extends Omit<IStory, '_id'>, Document {}

const StorySchema = new Schema<StoryDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  taggedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  visibility: {
    type: String,
    enum: ['public', 'matches-only'],
    default: 'public'
  }
}, {
  timestamps: true
})

StorySchema.index({ userId: 1 })
StorySchema.index({ createdAt: -1 })

export default mongoose.models.Story || mongoose.model<StoryDocument>('Story', StorySchema)

