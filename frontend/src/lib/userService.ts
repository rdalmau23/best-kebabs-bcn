import api from './api';

export interface UpdateProfileData {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<any> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<any[]> => {
  const response = await api.get('/users');
  return response.data;
};
