import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '../config/configuration';
import { LoggerModule } from './common/log/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsManagerModule } from './common/events/events.module';
import { QueueModule } from './queue/queue.module';
import { EmailModule } from './common/email/email.module';
import { EmailService } from './common/email/email.service';
import { BullConfigService } from 'config/bullConfigService';
import { BusinessProfileModule } from './business-profile/business-profile.module';
import { ClientModule } from './client/client.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    BullConfigService,
    UsersModule,
    EventsManagerModule,
    QueueModule,
    EmailModule,
    BusinessProfileModule,
    ClientModule,
    InvoiceModule,
    CloudinaryModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [EmailService, EventsManagerModule],
})
export class AppModule {}
