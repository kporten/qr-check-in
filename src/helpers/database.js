import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';

import getEnvironment from './environment.js';

export const databaseUrl = path.resolve(
  getEnvironment().DATABASE_URL,
  './database.json',
);

const database = low(new FileAsync(databaseUrl));

(async () => {
  (await database).defaults({ users: [] }).write();
})();

export default database;
