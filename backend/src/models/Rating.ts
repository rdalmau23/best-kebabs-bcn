import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  kebabId: mongoose.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
}

/**
 * Rating schema
 * Stores user ratings for kebab places
 */
const ratingSchema = new Schema<IRating>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  kebabId: {
    type: Schema.Types.ObjectId,
    ref: 'Kebab',
    required: [true, 'Kebab ID is required'],
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [5, 'Score cannot exceed 5'],
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique constraint: one rating per user per kebab
ratingSchema.index({ userId: 1, kebabId: 1 }, { unique: true });

// Index for querying ratings by kebab
ratingSchema.index({ kebabId: 1 });

export const Rating = mongoose.model<IRating>('Rating', ratingSchema);
