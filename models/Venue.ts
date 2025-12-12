import mongoose, { Schema, Document } from 'mongoose'
import { Venue as IVenue } from '@/types'

export interface VenueDocument extends Omit<IVenue, '_id'>, Document {}

const VenueSchema = new Schema<VenueDocument>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['restaurant', 'cafe', 'bar', 'activity-zone'],
    required: true
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
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
  images: [{ type: String }],
  description: { type: String },
  safetyRating: { type: Number, default: 5, min: 0, max: 5 },
  partnered: { type: Boolean, default: false },
  discountOffered: { type: Number, default: 0, min: 0, max: 100 }
}, {
  timestamps: true
})

VenueSchema.index({ location: '2dsphere' })
VenueSchema.index({ city: 1 })
VenueSchema.index({ partnered: 1 })

export default mongoose.models.Venue || mongoose.model<VenueDocument>('Venue', VenueSchema)

