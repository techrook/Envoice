import { InjectQueue } from '@nestjs/bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';

import { CONSTANT } from 'src/common/constants';
const {
  onUserRegister,
  sendConfirmationMail,
  onEmailConfirmationSend,
  AuthQ,
  onPasswordChange,
  onPasswordReset,
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
}
