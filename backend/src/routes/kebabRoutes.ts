import { Router } from 'express';
import kebabController from '../controllers/kebabController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Kebab routes
 */

// GET /api/kebabs - Get all kebabs
router.get('/', kebabController.getAllKebabs);

// GET /api/kebabs/:id - Get kebab by ID
router.get('/:id', kebabController.getKebabById);

// POST /api/kebabs - Create kebab (admin only)
router.post('/', authenticate, requireAdmin, kebabController.createKebab);

// PUT /api/kebabs/:id - Update kebab (admin only)
router.put('/:id', authenticate, requireAdmin, kebabController.updateKebab);

// DELETE /api/kebabs/:id - Delete kebab (admin only)
router.delete('/:id', authenticate, requireAdmin, kebabController.deleteKebab);

export default router;
