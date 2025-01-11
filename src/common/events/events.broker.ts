import { InjectQueue } from '@nestjs/bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';

import { CONSTANT } from 'src/common/constants';
const {
  onUserRegister,
  sendConfirmationMail,
  onEmailConfirmationSend,
  AuthQ,
  onUserLogin,
  onEmailConfirmation
} = CONSTANT;

export class EventBroker {
  private queues: { [key: string]: Queue } = {};

  constructor(@InjectQueue(AuthQ) private readonly authQ: Queue) {
    this.queues[AuthQ] = authQ;
  }

  @OnEvent(onUserRegister)
  async handleUserRegister(event) {
    const user = event.payload;
    await this.authQ.add(sendConfirmationMail, {
      user,
    });
  }

  @OnEvent(onEmailConfirmationSend)
  async handleSendEmailConfirmation(event) {
    const user = event.payload;
    await this.authQ.add('sendConfirmationMail', {
      user,
    });
  }

  @OnEvent(onUserLogin)
  async handleUserLogin(event) {
    const { userId, accessToken, refreshToken } = event.payload;
    await this.authQ.add(onUserLogin, {
      userId,
      accessToken,
      refreshToken,
    });
  }

  @OnEvent(onEmailConfirmation)
  async handleEmailConfirmation(event) {
    const { userId, token } = event.payload;
    await this.authQ.add('emailConfirmed', {
      userId,
      token,
    });
  }
}
