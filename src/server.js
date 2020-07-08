import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import emoji from 'node-emoji';

import { databaseUrl } from './helpers/database.js';
import logger from './helpers/pino.js';
import getEnvironment from './helpers/environment.js';
import controllerUsers from './controllers/users.js';

const app = express();

const pinoMiddleware = pinoHttp({
  logger,
});

app.use(helmet());
app.use(pinoMiddleware);

app.get('/', (request, response) => {
  response.send(`
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <div class="container mx-auto p-4">
      <div class="text-center text-2xl border border-gray-900 p-4 rounded">Hello ${
        emoji.random().emoji
      }</div>
    </div>
  `);
});

app.use('/users', controllerUsers);

app.listen(getEnvironment().PORT, () => {
  logger.info(`Server running on port ${getEnvironment().PORT}`);
  logger.info(`Database URL is ${databaseUrl}`);
  logger.info(
    `Datetime format is ${getEnvironment().DATETIME_FORMAT || 'ISO 8601'}`,
  );
});
