import mongoose, { Document, Schema } from 'mongoose';

export type KebabTag = 'halal' | '24h' | 'pollo' | 'ternera';

export interface IKebab extends Document {
  name: string;
  address: string;
  lat: number;
  lng: number;
  tags: KebabTag[];
  avgRating: number;
  ratingsCount: number;
}

/**
 * Kebab schema
 * Stores kebab place information and rating statistics
 */
const kebabSchema = new Schema<IKebab>({
  name: {
    type: String,
    required: [true, 'Kebab name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
  },
  tags: {
    type: [String],
    enum: ['halal', '24h', 'pollo', 'ternera'],
    default: [],
  },
  avgRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5'],
  },
  ratingsCount: {
    type: Number,
    default: 0,
    min: [0, 'Ratings count cannot be negative'],
  },
});

// Indexes for geospatial queries and search
kebabSchema.index({ lat: 1, lng: 1 });
kebabSchema.index({ name: 'text', address: 'text' });

export const Kebab = mongoose.model<IKebab>('Kebab', kebabSchema);
