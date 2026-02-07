import { Router } from 'express';
import { updateProfile, getUsers } from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', authenticate, requireAdmin, getUsers);

export default router;
