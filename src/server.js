import express from 'express';
import helmet from 'helmet';
import path from 'path';
import pinoHttp from 'pino-http';

import { databaseUrl } from './helpers/database.js';
import logger from './helpers/pino.js';
import getEnvironment from './helpers/environment.js';
import controllerUsers from './controllers/users.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve('./src/views'));

const pinoMiddleware = pinoHttp({
  logger,
});

app.use(helmet());
app.use(pinoMiddleware);

app.get('/', (request, response) => response.render('index'));

app.use('/users', controllerUsers);

app.use((error, request, response, next) => {
  logger.error(error);

  response.status(500).json({
    type: 'api_error',
    message: error.message,
  });

  next();
});

app.listen(getEnvironment().PORT, () => {
  logger.info(`Server running on port ${getEnvironment().PORT}`);
  logger.info(`Database URL is ${databaseUrl}`);
  logger.info(
    `Datetime format is ${getEnvironment().DATETIME_FORMAT || 'ISO 8601'}`,
  );
});
