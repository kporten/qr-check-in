import express from 'express';

import config from './config';
import loaders from './loaders';

const startApp = async () => {
  const app = express();

  const { logger } = await loaders({ expressApp: app });

  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`Database URL is ${config.DATABASE_URL}`);
    logger.info(`Datetime format is ${config.DATETIME_FORMAT || 'ISO 8601'}`);
  });
};

startApp();
