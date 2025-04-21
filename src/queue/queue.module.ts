import { Module } from '@nestjs/common';
import { SignUpConsumer } from './consumers/auth.consumer';
import { SignUpEventListener, BusinessEventListener } from './queue.listener';
import { PrismaClient } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BusinessProfileConsumer } from './consumers/business.consumer';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { UsersService } from 'src/users/users.service';
import { BusinessProfileService } from 'src/business-profile/business-profile.service';
import { InvoiceConsumer } from './consumers/invoice.consumer';
import { InvoiceService } from 'src/invoice/invoice.service';
@Module({
  providers: [SignUpConsumer, SignUpEventListener, PrismaClient, EmailService,PrismaService,BusinessProfileConsumer,FileUploadService,UsersService,BusinessProfileService,InvoiceConsumer,InvoiceService,BusinessEventListener], 

  imports: [],
})
export class QueueModule {}
