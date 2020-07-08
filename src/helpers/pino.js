import pino from 'pino';

import getEnvironment from './environment.js';

const logger = pino({
  prettyPrint:
    getEnvironment().NODE_ENV === 'production'
      ? false
      : {
          colorize: true,
        },
});

export default logger;
