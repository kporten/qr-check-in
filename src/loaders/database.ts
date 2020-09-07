import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import path from 'path';

import type { User } from '../models/user';

import config from '../config';

export const databaseUrl = path.resolve(config.DATABASE_URL, './database.json');

export type Database = low.LowdbAsync<{ users: User[] }>;

export default async (): Promise<Database> => {
  const database = low(new FileAsync<{ users: User[] }>(databaseUrl));

  (await database)
    .defaults<{ users: User[] }>({ users: [] })
    .write();

  return database;
};
