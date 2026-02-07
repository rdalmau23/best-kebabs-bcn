import { Router } from 'express';
import ratingController from '../controllers/ratingController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Rating routes
 */

// POST /api/ratings - Create or update rating (authenticated users only)
router.post('/', authenticate, ratingController.createOrUpdateRating);

// GET /api/ratings - Get all ratings (admin only)
router.get('/', authenticate, requireAdmin, ratingController.getAllRatings);

// GET /api/ratings/:kebabId - Get ratings for a kebab
router.get('/:kebabId', ratingController.getRatingsByKebab);

// DELETE /api/ratings/:id - Delete rating (admin only)
router.delete('/:id', authenticate, requireAdmin, ratingController.deleteRating);

export default router;
