import { Module } from '@nestjs/common';
import {
    SignUpConsumer,
  } from './consumers/auth.consumer';
  import {
    SignUpEventListener,
  } from './queue.listener';
import { PrismaClient } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
@Module({
    providers: [
        SignUpConsumer,
        SignUpEventListener,
      PrismaClient,
      EmailService],
    
    imports:[

    ],
})
export class QueueModule {}
