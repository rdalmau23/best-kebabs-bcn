import { Request, Response } from 'express';
import kebabService from '../services/kebabService';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

/**
 * Kebab controller
 * Handles HTTP requests for kebab operations
 */
class KebabController {
  /**
   * Get all kebabs
   * GET /api/kebabs
   */
  async getAllKebabs(req: Request, res: Response): Promise<void> {
    try {
      const kebabs = await kebabService.getAllKebabs();
      res.status(200).json(kebabs);
    } catch (error: any) {
      logger.error('Get all kebabs failed', { error: error.message });
      res.status(500).json({ message: 'Failed to retrieve kebabs' });
    }
  }

  /**
   * Get kebab by ID
   * GET /api/kebabs/:id
   */
  async getKebabById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const kebab = await kebabService.getKebabById(id);

      if (!kebab) {
        res.status(404).json({ message: 'Kebab not found' });
        return;
      }

      res.status(200).json(kebab);
    } catch (error: any) {
      logger.error('Get kebab by ID failed', { error: error.message });
      res.status(500).json({ message: 'Failed to retrieve kebab' });
    }
  }

  /**
   * Create a new kebab (admin only)
   * POST /api/kebabs
   */
  async createKebab(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, address, lat, lng, tags } = req.body;

      if (!name || !address || lat === undefined || lng === undefined) {
        res.status(400).json({ message: 'Name, address, lat, and lng are required' });
        return;
      }

      const kebab = await kebabService.createKebab({
        name,
        address,
        lat,
        lng,
        tags,
      });

      res.status(201).json(kebab);
    } catch (error: any) {
      logger.error('Create kebab failed', { error: error.message });
      res.status(400).json({ message: error.message || 'Failed to create kebab' });
    }
  }
}

export default new KebabController();
