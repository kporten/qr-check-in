import express from 'express';
import { nanoid } from 'nanoid';
import qrcode from 'qrcode';
import url from 'url';

import * as User from '../models/user.js';

const router = express.Router();

router.get('/:name/register', async (request, response) => {
  const name = request.params.name.toLowerCase();

  let user = await User.get({ name });

  if (!user) {
    user = await User.add({ name, token: nanoid(6) });
  }

  const origin = url.format({
    protocol: request.protocol,
    host: request.get('host'),
  });

  const checkInUrl = `${origin}${request.baseUrl}/${user.token}/check-in`;
  const checkOutUrl = `${origin}${request.baseUrl}/${user.token}/check-out`;

  const qrcodeCheckIn = await qrcode.toDataURL(checkInUrl);
  const qrcodeCheckOut = await qrcode.toDataURL(checkOutUrl);

  response.send(`
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl py-4 text-center lg:text-left">${user.name}</h1>
      <div class="lg:flex lg:space-x-10 space-y-10 lg:space-y-0">
        <div class="text-center border border-gray-900 p-4 rounded">
          <h2 class="text-2xl">Check-in</h2>
          <img src="${qrcodeCheckIn}" alt="${user.name}" class="inline" />
          <p>${checkInUrl}</p>
        </div>
        <div class="text-center border border-gray-900 p-4 rounded">
          <h2 class="text-2xl">Check-out</h2>
          <img src="${qrcodeCheckOut}" alt="${user.name}" class="inline" />
          <p>${checkOutUrl}</p>
        </div>
      </div>
    </div>
  `);
});

router.get('/:token/check-in', async (request, response) => {
  const user = await User.addHistory(request.params.token, 'CHECK_IN');

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.send(`
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <div class="container mx-auto p-4">
      <div class="text-center text-2xl border border-gray-900 p-4 rounded">Check-in logged. Thank you.</div>
    </div>
  `);
});

router.get('/:token/check-out', async (request, response) => {
  const user = await User.addHistory(request.params.token, 'CHECK_OUT');

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.send(`
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <div class="container mx-auto p-4">
      <div class="text-center text-2xl border border-gray-900 p-4 rounded">Check-out logged. Thank you.</div>
    </div>
  `);
});

export default router;
