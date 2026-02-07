import { Router } from 'express';
import ratingController from '../controllers/ratingController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Rating routes
 */

// POST /api/ratings - Create or update rating (authenticated users only)
router.post('/', authenticate, ratingController.createOrUpdateRating);

// GET /api/ratings/:kebabId - Get ratings for a kebab
router.get('/:kebabId', ratingController.getRatingsByKebab);

export default router;
