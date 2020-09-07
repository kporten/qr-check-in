import { nanoid } from 'nanoid';

import type { Database } from '@loaders/database';

export type User = {
  id: string;
  name: string;
  token: string;
  history: UserHistory[];
};

export type UserHistory = {
  event: 'CHECK_IN' | 'CHECK_OUT';
  ts: string;
};

class UserModel {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  async get(
    where: Partial<Pick<User, 'id' | 'name' | 'token'>>,
  ): Promise<User> {
    return this.#database.get('users').find(where).value();
  }

  async add(user: Omit<User, 'id'>): Promise<User> {
    const newUser = { ...user, id: nanoid() };

    await this.#database.get('users').push(newUser).write();

    return newUser;
  }

  async update(user: User): Promise<void> {
    await this.#database
      .get('users')
      .find({ id: user.id })
      .assign(user)
      .write();
  }
}

export default UserModel;
