import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import config from '../config';
import logger from '../utils/logger';

/**
 * Authentication service
 * Handles user registration, login, and token generation
 */
class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Register a new user
   */
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

      // Create user
      const user = await User.create({
        username,
        email,
        passwordHash,
        role: 'user',
      });

      logger.info('User registered successfully', { userId: user._id, username });

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error('User registration failed', { error, email });
      throw error;
    }
  }

  /**
   * Login user with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      // Find user
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      logger.info('User authenticated successfully', { userId: user._id });

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error('User authentication failed', { error, email });
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-passwordHash');
      return user;
    } catch (error) {
      logger.error('Failed to retrieve user', { error, userId });
      throw error;
    }
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(user: IUser): string {
    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };
    
    const expiresIn = config.jwt.expiresIn as SignOptions['expiresIn'];
    const options: SignOptions = {
      expiresIn,
    };

    return jwt.sign(payload, config.jwt.secret, options);
  }
}

export default new AuthService();
