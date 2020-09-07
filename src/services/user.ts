import produce from 'immer';
import uniqWith from 'lodash/uniqWith';
import moment from 'moment';
import { nanoid } from 'nanoid';
import qrcode from 'qrcode';

import type { User, UserHistory } from '@models/user';

import config from '@config';
import UserModel from '@models/user';

class UserService {
  #userModel: UserModel;

  constructor(userModel: UserModel) {
    this.#userModel = userModel;
  }

  async getByName(name: User['name']): Promise<User> {
    return this.#userModel.get({ name });
  }

  async signup(name: User['name']): Promise<User> {
    let user = await this.#userModel.get({ name });

    if (!user) {
      user = await this.#userModel.add({
        name,
        token: nanoid(6),
        history: [],
      });
    }

    return user;
  }

  async generateQr(
    id: string,
    url: string,
  ): Promise<{
    checkInUrl: string;
    checkInQr: string;
    checkOutUrl: string;
    checkOutQr: string;
  } | null> {
    const user = await this.#userModel.get({ id });

    if (user) {
      const checkInUrl = `${url}/${user.token}/check-in`;
      const checkOutUrl = `${url}/${user.token}/check-out`;

      const [checkInQr, checkOutQr] = await Promise.all([
        qrcode.toDataURL(checkInUrl),
        qrcode.toDataURL(checkOutUrl),
      ]);

      return { checkInUrl, checkInQr, checkOutUrl, checkOutQr };
    }

    return null;
  }

  async addHistoryEntry(
    token: User['token'],
    event: UserHistory['event'],
  ): Promise<User> {
    const user = await this.#userModel.get({ token });

    if (user) {
      const ts = moment().format(config.DATETIME_FORMAT);

      const nextUser = produce(user, (draft) => {
        draft.history = uniqWith(
          [...draft.history, { event, ts }],
          (a, b) => a.event === b.event && a.ts === b.ts,
        );
      });

      await this.#userModel.update(nextUser);
    }

    return user;
  }
}

export default UserService;
