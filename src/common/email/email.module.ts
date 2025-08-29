import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/JWT Strategy/jwt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is set up
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'), // 587
          secure: false, // ← Must be false for port 587
          requireTLS: true, // ← Ensures STARTTLS is used
          auth: {
            user: config.get<string>('MAIL_USERNAME'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
          debug: true,
        },
        
      }),
    }),
  ],
  providers: [EmailService, PrismaService,JwtStrategy,UsersService],
})
export class EmailModule {}
