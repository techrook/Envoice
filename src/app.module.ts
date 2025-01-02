import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '../config/configuration';
import { LoggerModule } from './common/log/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
      validate,
  }),
  LoggerModule,
  PrismaModule,
  AuthModule,
  UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}