import { Kebab, IKebab } from '../models/Kebab';
import logger from '../utils/logger';

/**
 * Service for kebab-related business logic
 */
class KebabService {
  /**
   * Get all kebabs
   */
  async getAllKebabs(): Promise<IKebab[]> {
    try {
      const kebabs = await Kebab.find().sort({ avgRating: -1 });
      return kebabs;
    } catch (error) {
      logger.error('Failed to retrieve kebabs', { error });
      throw error;
    }
  }

  /**
   * Get kebab by ID
   */
  async getKebabById(kebabId: string): Promise<IKebab | null> {
    try {
      const kebab = await Kebab.findById(kebabId);
      return kebab;
    } catch (error) {
      logger.error('Failed to retrieve kebab', { error, kebabId });
      throw error;
    }
  }

  /**
   * Create a new kebab (admin only)
   */
  async createKebab(data: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    tags?: string[];
  }): Promise<IKebab> {
    try {
      const kebab = await Kebab.create(data);
      logger.info('Kebab created successfully', { kebabId: kebab._id, name: data.name });
      return kebab;
    } catch (error) {
      logger.error('Failed to create kebab', { error, data });
      throw error;
    }
  }

  /**
   * Update kebab rating statistics
   * Called after a rating is created or updated
   */
  async updateKebabRating(
    kebabId: string,
    avgRating: number,
    ratingsCount: number
  ): Promise<void> {
    try {
      await Kebab.findByIdAndUpdate(kebabId, {
        avgRating,
        ratingsCount,
      });
      logger.info('Kebab rating updated', { kebabId, avgRating, ratingsCount });
    } catch (error) {
      logger.error('Failed to update kebab rating', { error, kebabId });
      throw error;
    }
  }

  /**
   * Update kebab (admin only)
   */
  async updateKebab(
    kebabId: string,
    data: {
      name?: string;
      address?: string;
      lat?: number;
      lng?: number;
      tags?: string[];
    }
  ): Promise<IKebab | null> {
    try {
      const kebab = await Kebab.findByIdAndUpdate(kebabId, data, { new: true });
      
      if (!kebab) {
        throw new Error('Kebab not found');
      }

      logger.info('Kebab updated successfully', { kebabId, name: data.name });
      return kebab;
    } catch (error) {
      logger.error('Failed to update kebab', { error, kebabId });
      throw error;
    }
  }

  /**
   * Delete kebab (admin only)
   */
  async deleteKebab(kebabId: string): Promise<void> {
    try {
      const kebab = await Kebab.findByIdAndDelete(kebabId);
      
      if (!kebab) {
        throw new Error('Kebab not found');
      }

      logger.info('Kebab deleted successfully', { kebabId, name: kebab.name });
    } catch (error) {
      logger.error('Failed to delete kebab', { error, kebabId });
      throw error;
    }
  }
}

export default new KebabService();
