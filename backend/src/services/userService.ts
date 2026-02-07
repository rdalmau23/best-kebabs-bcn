import bcrypt from 'bcrypt';
import { User } from '../models/User';
import logger from '../utils/logger';

export interface UpdateProfileData {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updateData: UpdateProfileData
): Promise<any> => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // If changing password, verify current password
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new Error('Current password is required to change password');
      }

      const isValidPassword = await bcrypt.compare(
        updateData.currentPassword,
        user.passwordHash
      );

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      user.passwordHash = await bcrypt.hash(updateData.newPassword, 10);
    }

    // Update other fields
    if (updateData.username) {
      user.username = updateData.username;
    }

    if (updateData.email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new Error('Email is already taken');
      }
      
      user.email = updateData.email;
    }

    await user.save();

    logger.info('User profile updated', { userId: user._id, username: user.username });

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    logger.error('Failed to update user profile', { error, userId });
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    logger.info('Retrieved all users', { count: users.length });

    return users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  } catch (error) {
    logger.error('Failed to get all users', { error });
    throw error;
  }
};
