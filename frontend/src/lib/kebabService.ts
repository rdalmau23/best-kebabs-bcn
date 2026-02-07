import apiClient from './api';
import type { Kebab, Rating, CreateRatingData } from '@/types';

/**
 * Service for kebab-related API calls
 */
class KebabService {
  /**
   * Get all kebabs
   */
  async getKebabs(): Promise<Kebab[]> {
    const response = await apiClient.get<Kebab[]>('/kebabs');
    return response.data;
  }

  /**
   * Get kebab by ID
   */
  async getKebabById(id: string): Promise<Kebab> {
    const response = await apiClient.get<Kebab>(`/kebabs/${id}`);
    return response.data;
  }

  /**
   * Get ratings for a kebab
   */
  async getRatings(kebabId: string): Promise<Rating[]> {
    const response = await apiClient.get<Rating[]>(`/ratings/${kebabId}`);
    return response.data;
  }

  /**
   * Create or update a rating
   */
  async createRating(data: CreateRatingData): Promise<Rating> {
    const response = await apiClient.post<Rating>('/ratings', data);
    return response.data;
  }

  /**
   * Create a kebab (admin only)
   */
  async createKebab(data: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    tags?: string[];
  }): Promise<Kebab> {
    const response = await apiClient.post<Kebab>('/kebabs', data);
    return response.data;
  }
}

export default new KebabService();

// Named exports for convenience
export const getKebabs = () => new KebabService().getKebabs();
export const getKebabById = (id: string) => new KebabService().getKebabById(id);
export const getRatings = (kebabId: string) => new KebabService().getRatings(kebabId);
export const createRating = (data: CreateRatingData) => new KebabService().createRating(data);
export const createKebab = (data: { name: string; address: string; lat: number; lng: number; tags?: string[] }) => 
  new KebabService().createKebab(data);
