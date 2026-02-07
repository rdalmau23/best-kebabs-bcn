import { Router } from 'express';
import authRoutes from './authRoutes';
import kebabRoutes from './kebabRoutes';
import ratingRoutes from './ratingRoutes';

const router = Router();

/**
 * Main API router
 * Combines all route modules
 */

router.use('/auth', authRoutes);
router.use('/kebabs', kebabRoutes);
router.use('/ratings', ratingRoutes);

export default router;
