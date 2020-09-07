import { Router } from 'express';

import type { Database } from '@loaders/database';

import users from './routes/users';

export default (database: Database): Router => {
  const router = Router();

  users(router, database);

  return router;
};
