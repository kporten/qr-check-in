import type { Express, NextFunction, Request, Response } from 'express';
import type P from 'pino';

import helmet from 'helmet';
import path from 'path';
import pinoHttp from 'pino-http';

import api from '@api';

import type { Database } from './database';

export default ({
  app,
  database,
  logger,
}: {
  app: Express;
  database: Database;
  logger: P.Logger;
}): void => {
  app.set('view engine', 'pug');
  app.set('views', path.resolve('./src/views'));

  app.use(helmet());
  app.use(
    pinoHttp({
      logger,
    }),
  );

  app.get('/', (_request, response) => response.render('index'));

  app.use('/api/v1', api(database));

  app.use(
    (
      error: Error,
      _request: Request,
      response: Response,
      next: NextFunction,
    ) => {
      logger.error(error);

      response.status(500).json({
        type: 'api_error',
        message: error.message,
      });

      next();
    },
  );
};
