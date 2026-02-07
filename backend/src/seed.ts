import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Kebab } from './models/Kebab';
import { connectDatabase, disconnectDatabase } from './config/database';
import logger from './utils/logger';

/**
 * Development seed data
 * Hardcoded kebab places in Barcelona for testing
 */
const seedKebabs = [
  {
    name: 'Kebab Istanbul',
    address: 'Carrer de la Marina 123, Barcelona',
    lat: 41.3851,
    lng: 2.1734,
    tags: ['halal', '24h'],
  },
  {
    name: 'El Mejor Kebab',
    address: 'Carrer de Balmes 45, Barcelona',
    lat: 41.3874,
    lng: 2.1585,
    tags: ['halal', 'pollo', 'ternera'],
  },
  {
    name: 'Kebab House',
    address: "Passeig de Gràcia 78, Barcelona",
    lat: 41.3922,
    lng: 2.1649,
    tags: ['halal', 'pollo'],
  },
  {
    name: 'Istanbul Doner Kebab',
    address: 'Carrer del Consell de Cent 234, Barcelona',
    lat: 41.3869,
    lng: 2.1654,
    tags: ['halal', '24h', 'ternera'],
  },
  {
    name: 'King Kebab',
    address: 'La Rambla 56, Barcelona',
    lat: 41.3818,
    lng: 2.1735,
    tags: ['24h', 'pollo'],
  },
];

/**
 * Seed admin user for testing
 */
const seedAdminUser = async (): Promise<void> => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@kebabs.bcn' });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@kebabs.bcn',
        passwordHash,
        role: 'admin',
      });
      logger.info('Admin user created', { email: 'admin@kebabs.bcn' });
    }
  } catch (error) {
    logger.error('Failed to create admin user', { error });
  }
};

/**
 * Seed development data
 */
const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();

    // Check if data already exists
    const existingKebabs = await Kebab.countDocuments();

    if (existingKebabs === 0) {
      await Kebab.insertMany(seedKebabs);
      logger.info('Development kebabs seeded', { count: seedKebabs.length });
    } else {
      logger.info('Kebabs already exist, skipping seed', { count: existingKebabs });
    }

    // Create admin user
    await seedAdminUser();

    await disconnectDatabase();
    logger.info('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed', { error });
    process.exit(1);
  }
};

// Run seed if executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
