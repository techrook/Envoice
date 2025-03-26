import { Module } from '@nestjs/common';
import { SignUpConsumer } from './consumers/auth.consumer';
import { SignUpEventListener, BusinessEventListener } from './queue.listener';
import { PrismaClient } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BusinessProfileConsumer } from './consumers/business.consumer';

@Module({
  providers: [SignUpConsumer, SignUpEventListener, PrismaClient, EmailService,PrismaService,BusinessProfileConsumer, ],

  imports: [],
})
export class QueueModule {}
