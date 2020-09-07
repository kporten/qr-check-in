import pino from 'pino';

import config from '../config';

export default pino({
  prettyPrint:
    config.NODE_ENV !== 'production'
      ? {
          colorize: true,
        }
      : false,
});
