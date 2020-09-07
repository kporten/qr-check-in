import type { Express } from 'express';

import type { Database } from './database';

import databaseLoader from './database';
import expressLoader from './express';
import loggerLoader from './logger';

export default async ({
  expressApp,
}: {
  expressApp: Express;
}): Promise<{ database: Database; logger: typeof loggerLoader }> => {
  const database = await databaseLoader();

  expressLoader({ app: expressApp, database, logger: loggerLoader });

  return { database, logger: loggerLoader };
};
