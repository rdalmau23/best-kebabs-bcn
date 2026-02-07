import api from './api';
import { Kebab } from '@/types';

/**
 * Update a kebab (admin only)
 */
export const updateKebab = async (id: string, data: Partial<Kebab>): Promise<Kebab> => {
  const response = await api.put(`/kebabs/${id}`, data);
  return response.data;
};

/**
 * Delete a kebab (admin only)
 */
export const deleteKebab = async (id: string): Promise<void> => {
  await api.delete(`/kebabs/${id}`);
};

/**
 * Get all ratings (admin only)
 */
export const getAllRatings = async (): Promise<any[]> => {
  const response = await api.get('/ratings');
  return response.data;
};

/**
 * Delete a rating (admin only)
 */
export const deleteRating = async (id: string): Promise<void> => {
  await api.delete(`/ratings/${id}`);
};
