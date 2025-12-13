import { InjectQueue } from '@nestjs/bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { on } from 'events';
import { CONSTANT } from 'src/common/constants';
const {
  onPasswordChange,
  onUserRegister,
  onPasswordReset,
  sendConfirmationMail,
  onEmailConfirmationSend,
  AuthQ,
  BusinessQ,
  InvoiceQ,
  onUserLogin,
  onEmailConfirmation,
  onBusinessProfileCreated,
  onBusinessProfileUpdated,
  onInvoiceCreated,
  onUserProfileUpdated
} = CONSTANT;

export class EventBroker {
  private queues: Record<string, Queue> = {};

  constructor(
    @InjectQueue(AuthQ) private readonly authQ: Queue, 
    @InjectQueue(BusinessQ) private readonly businessQ: Queue,
    @InjectQueue(InvoiceQ) private readonly invoiceQ: Queue
  ) {
    this.queues[AuthQ] = authQ;
    this.queues[BusinessQ] = businessQ;
    this.queues[InvoiceQ] = invoiceQ;
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

  @OnEvent(onPasswordReset)
  async handlePasswordReset(event) {
    const { user, priority } = event;
    await this.authQ.add(onPasswordReset, {
      user,
      priority,
    });
  }

  @OnEvent(onBusinessProfileCreated)
  async handleBusinessProfileCreated(event) {
    const { userId, file } = event;
    await this.businessQ.add(onBusinessProfileCreated, {
      userId,
      file,
    });
  }

  @OnEvent(onBusinessProfileUpdated)
  async handleBusinessProfileUpdated(event) {
    const { userId, file } = event;
    await this.businessQ.add(onBusinessProfileUpdated, {
      userId,
      file,
    });
  }

    @OnEvent(onUserProfileUpdated)
  async handleUserProfileUpdate(event) {
    const { userId, file } = event;
    await this.businessQ.add(onUserProfileUpdated, {
      userId,
      file,
    });
  }

  @OnEvent(onPasswordChange)
  async handlePasswordChangeSuccess(event) {
    const { payload, priority } = event;
    await this.authQ.add(
      onPasswordChange,
      {
        payload,
      },
      {
        ...priority,
      },
    );
  }
  @OnEvent(onInvoiceCreated)
  async handleInvoiceCreated(event) {
    const { userId, clientId, invoice } = event;
    await this.invoiceQ.add(onInvoiceCreated, {
      userId,
      clientId,
      invoice,
    });
  }
}