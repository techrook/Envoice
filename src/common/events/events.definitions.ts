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

export class PasswordResetEvent {
  constructor(public payload: { user: User; priority: Priority }) {}
}