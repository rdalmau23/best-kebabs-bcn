import { Rating, IRating } from '../models/Rating';
import kebabService from './kebabService';
import logger from '../utils/logger';

/**
 * Service for rating-related business logic
 * Implements the rating algorithm specified in project requirements
 */
class RatingService {
  /**
   * Create or update a rating
   * Algorithm: findRating(userId, kebabId) -> updateOrCreate -> recalcKebabStats(kebabId)
   */
  async createOrUpdateRating(
    userId: string,
    kebabId: string,
    score: number,
    comment?: string
  ): Promise<IRating> {
    try {
      // Check if rating exists for this user and kebab
      const existingRating = await Rating.findOne({ userId, kebabId });

      let rating: IRating;

      if (existingRating) {
        // Update existing rating
        existingRating.score = score;
        existingRating.comment = comment;
        rating = await existingRating.save();
        logger.info('Rating updated', { ratingId: rating._id, userId, kebabId });
      } else {
        // Create new rating
        rating = await Rating.create({
          userId,
          kebabId,
          score,
          comment,
        });
        logger.info('Rating created', { ratingId: rating._id, userId, kebabId });
      }

      // Recalculate kebab statistics
      await this.recalculateKebabStats(kebabId);

      return rating;
    } catch (error) {
      logger.error('Failed to create or update rating', { error, userId, kebabId });
      throw error;
    }
  }

  /**
   * Get all ratings for a kebab
   */
  async getRatingsByKebab(kebabId: string): Promise<IRating[]> {
    try {
      const ratings = await Rating.find({ kebabId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
      return ratings;
    } catch (error) {
      logger.error('Failed to retrieve ratings', { error, kebabId });
      throw error;
    }
  }

  /**
   * Recalculate average rating and count for a kebab
   * Updates the denormalized values in the Kebab model
   */
  private async recalculateKebabStats(kebabId: string): Promise<void> {
    try {
      const ratings = await Rating.find({ kebabId });

      const ratingsCount = ratings.length;
      const avgRating =
        ratingsCount > 0
          ? ratings.reduce((sum, r) => sum + r.score, 0) / ratingsCount
          : 0;

      await kebabService.updateKebabRating(
        kebabId,
        Math.round(avgRating * 10) / 10, // Round to 1 decimal
        ratingsCount
      );

      logger.info('Kebab stats recalculated', { kebabId, avgRating, ratingsCount });
    } catch (error) {
      logger.error('Failed to recalculate kebab stats', { error, kebabId });
      throw error;
    }
  }
}

export default new RatingService();
