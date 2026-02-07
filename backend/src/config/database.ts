import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Database connection established', {
      database: mongoose.connection.name,
    });
  } catch (error) {
    logger.error('Database connection failed', { error });
    process.exit(1);
  }
};

/**
 * Close database connection
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', { error });
  }
};

export default { connectDatabase, disconnectDatabase };
