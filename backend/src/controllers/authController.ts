import { Request, Response } from 'express';
import authService from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

/**
 * Authentication controller
 * Handles HTTP requests for user authentication
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      const { user, token } = await authService.register(username, email, password);

      res.status(201).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error: any) {
      logger.error('Registration request failed', { error: error.message });
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const { user, token } = await authService.login(email, password);

      res.status(200).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error: any) {
      logger.error('Login request failed', { error: error.message });
      res.status(401).json({ message: error.message || 'Login failed' });
    }
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      logger.error('Get current user failed', { error: error.message });
      res.status(500).json({ message: 'Failed to retrieve user' });
    }
  }
}

export default new AuthController();
