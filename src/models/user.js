import { nanoid } from 'nanoid';

import database from '../helpers/database.js';

export const get = async (where) => {
  return (await database).get('users').find(where).value();
};

export const add = async ({ name, token }) => {
  const user = {
    id: nanoid(),
    name,
    token,
    history: [],
  };

  await (await database).get('users').push(user).write();

  return user;
};

export const addHistory = async (token, { event, ts }) => {
  const user = await get({ token });

  if (user) {
    await (await database)
      .get('users')
      .find({ token })
      .assignWith({ history: { event, ts } }, (current, value) => [
        ...current,
        value,
      ])
      .write();
  }

  return user;
};
