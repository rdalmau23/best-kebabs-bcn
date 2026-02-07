import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { updateUserProfile, getAllUsers } from '../services/userService';
import logger from '../utils/logger';

/**
 * Update user profile
 * PUT /api/users/profile
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { username, email, currentPassword, newPassword } = req.body;

    const updatedUser = await updateUserProfile(userId, {
      username,
      email,
      currentPassword,
      newPassword,
    });

    res.json(updatedUser);
  } catch (error: any) {
    logger.error('Update profile error', { error: error.message });
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
};

/**
 * Get all users (admin only)
 * GET /api/users
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    logger.error('Get users error', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};
