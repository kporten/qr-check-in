import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';

const filePath = path.resolve(
  process.env.DATABASE_URL || '',
  './database.json',
);

const database = low(new FileAsync(filePath));

(async () => {
  (await database).defaults({ users: [] }).write();
})();

export default database;
