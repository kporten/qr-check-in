import express from 'express';
import { nanoid } from 'nanoid';
import emoji from 'node-emoji';
import qrcode from 'qrcode';
import url from 'url';

import * as User from '../models/user.js';

const router = express.Router();

router.get('/register', async (request, response, next) => {
  try {
    if (!request.query.name) {
      response.status(400).json({
        type: 'invalid_request_error',
        code: 'parameter_invalid_empty',
        param: 'name',
        message: '-name- is required (e.g. GET /users/register?name=john)',
      });

      return;
    }

    const name = request.query.name.toLowerCase();

    let user = await User.get({ name });

    if (!user) {
      user = await User.add({ name, token: nanoid(6) });
    }

    const origin = url.format({
      protocol: request.protocol,
      host: request.get('host'),
    });

    const address = {
      checkIn: `${origin}${request.baseUrl}/${user.token}/check-in`,
      checkOut: `${origin}${request.baseUrl}/${user.token}/check-out`,
    };

    const [checkIn, checkOut] = await Promise.all([
      qrcode.toDataURL(address.checkIn),
      qrcode.toDataURL(address.checkOut),
    ]);

    response.render('users/register', {
      user,
      address,
      qr: { checkIn, checkOut },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:token/check-in', async (request, response, next) => {
  try {
    const user = await User.addHistory(request.params.token, 'CHECK_IN');

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

router.get('/:token/check-out', async (request, response, next) => {
  try {
    const user = await User.addHistory(request.params.token, 'CHECK_OUT');

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

export default router;
