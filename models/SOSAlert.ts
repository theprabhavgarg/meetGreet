import mongoose, { Schema, Document } from 'mongoose'
import { SOSAlert as ISOSAlert } from '@/types'

export interface SOSAlertDocument extends Omit<ISOSAlert, '_id'>, Document {}

const SOSAlertSchema = new Schema<SOSAlertDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  description: String,
  status: {
    type: String,
    enum: ['active', 'resolved', 'false-alarm'],
    default: 'active'
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  notes: String
}, {
  timestamps: true
})

SOSAlertSchema.index({ userId: 1 })
SOSAlertSchema.index({ status: 1 })
SOSAlertSchema.index({ createdAt: -1 })

export default mongoose.models.SOSAlert || mongoose.model<SOSAlertDocument>('SOSAlert', SOSAlertSchema)

