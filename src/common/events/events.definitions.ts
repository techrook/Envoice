import { User } from '@prisma/client';
import { Priority } from './events.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CONSTANT } from 'src/common/constants';

export class UserRegisterEvent {
  constructor(
    public payload: { id: string; email: string; username: string },
  ) {}
}

export class UserConfirmedMailEvent {
  constructor(public payload: { userId: string }) {}
}

export class UserLoginEvent {
  constructor(
    public payload: {
      userId: any;
      accessToken?: string;
      refreshToken?: string;
    },
  ) {}
}

export class PassChangeSuccess {
  constructor(
    public payload,
    public priority?: Priority,
  ) {}
}

export class PasswordResetEvent {
  constructor(
    public user: User,
    public priority: Priority,
  ) {}
}

export class BusinessProfileCreatedEvent {
  constructor(
    public userId: string,
    public file: Express.Multer.File,
  ) {}
}

export class BusinessProfileUpdatedEvent {
  constructor(
    public userId: string,
    public file: Express.Multer.File,
  ) {}
}

export class InvoiceCreatedEvent {
  constructor(
    public userId: string,
    public clientId: string,
    public invoice: object,
  ) {}
}