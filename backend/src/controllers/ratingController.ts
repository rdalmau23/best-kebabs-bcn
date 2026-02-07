import { Response } from 'express';
import ratingService from '../services/ratingService';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

/**
 * Rating controller
 * Handles HTTP requests for rating operations
 */
class RatingController {
  /**
   * Create or update a rating
   * POST /api/ratings
   */
  async createOrUpdateRating(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const { kebabId, score, comment } = req.body;

      if (!kebabId || !score) {
        res.status(400).json({ message: 'Kebab ID and score are required' });
        return;
      }

      if (score < 1 || score > 5) {
        res.status(400).json({ message: 'Score must be between 1 and 5' });
        return;
      }

      const rating = await ratingService.createOrUpdateRating(
        userId,
        kebabId,
        score,
        comment
      );

      res.status(200).json(rating);
    } catch (error: any) {
      logger.error('Create or update rating failed', { error: error.message });
      res.status(400).json({ message: error.message || 'Failed to save rating' });
    }
  }

  /**
   * Get ratings for a kebab
   * GET /api/ratings/:kebabId
   */
  async getRatingsByKebab(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { kebabId } = req.params;

      const ratings = await ratingService.getRatingsByKebab(kebabId);

      res.status(200).json(ratings);
    } catch (error: any) {
      logger.error('Get ratings by kebab failed', { error: error.message });
      res.status(500).json({ message: 'Failed to retrieve ratings' });
    }
  }

  /**
   * Get all ratings (admin only)
   * GET /api/ratings
   */
  async getAllRatings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ratings = await ratingService.getAllRatings();
      res.status(200).json(ratings);
    } catch (error: any) {
      logger.error('Get all ratings failed', { error: error.message });
      res.status(500).json({ message: 'Failed to retrieve ratings' });
    }
  }

  /**
   * Delete a rating (admin only)
   * DELETE /api/ratings/:id
   */
  async deleteRating(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ratingService.deleteRating(id);
      res.status(204).send();
    } catch (error: any) {
      logger.error('Delete rating failed', { error: error.message });
      res.status(400).json({ message: error.message || 'Failed to delete rating' });
    }
  }
}

export default new RatingController();
