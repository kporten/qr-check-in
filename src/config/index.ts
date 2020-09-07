import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config = {
  DATABASE_URL: path.resolve(process.env.DATABASE_URL || ''),
  DATETIME_FORMAT: process.env.DATETIME_FORMAT || '',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
};

export default config;
