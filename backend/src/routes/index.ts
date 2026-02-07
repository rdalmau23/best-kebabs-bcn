import { Router } from 'express';
import authRoutes from './authRoutes';
import kebabRoutes from './kebabRoutes';
import ratingRoutes from './ratingRoutes';
import userRoutes from './userRoutes';

const router = Router();

/**
 * Main API router
 * Combines all route modules
 */

router.use('/auth', authRoutes);
router.use('/kebabs', kebabRoutes);
router.use('/ratings', ratingRoutes);
router.use('/users', userRoutes);

export default router;
