import { Router } from 'express';
import emoji from 'node-emoji';
import url from 'url';

import type { Database } from '@loaders/database';

import UserModel from '@models/user';
import UserService from '@services/user';

const route = Router();

export default (router: Router, database: Database): void => {
  const userService = new UserService(new UserModel(database));

  router.use('/users', route);

  route.get('/register', async (request, response, next) => {
    try {
      if (!request.query.name) {
        response.status(400).json({
          type: 'invalid_request_error',
          code: 'parameter_invalid_empty',
          param: 'name',
          message: '-name- is required',
        });

        return;
      }

      const name = (request.query.name as string).toLowerCase();

      const origin = url.format({
        protocol: request.protocol,
        host: request.get('host'),
        pathname: request.baseUrl,
      });

      const user = await userService.signup(name);
      const qr = await userService.generateQr(user.id, origin);

      response.render('users/register', { user, qr });
    } catch (error) {
      next(error);
    }
  });

  route.get('/:token/check-in', async (request, response, next) => {
    try {
      const user = await userService.addHistoryEntry(
        request.params.token,
        'CHECK_IN',
      );

      if (!user) {
        response.sendStatus(404);
        return;
      }

      response.render('users/check-in', {
        emoji: emoji.get('heart'),
      });
    } catch (error) {
      next(error);
    }
  });

  route.get('/:token/check-out', async (request, response, next) => {
    try {
      const user = await userService.addHistoryEntry(
        request.params.token,
        'CHECK_OUT',
      );

      if (!user) {
        response.sendStatus(404);
        return;
      }

      response.render('users/check-out', {
        emoji: emoji.get('heart'),
      });
    } catch (error) {
      next(error);
    }
  });
};
