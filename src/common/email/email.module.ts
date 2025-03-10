import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/JWT Strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is set up
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: Number(config.get<string>('MAIL_PORT')), // Ensure it's a number
          secure: true, // Use false for port 587 (STARTTLS)
          auth: {
            user: config.get<string>('MAIL_USERNAME'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
          logger: true,
          debug: true,
        },
        
      }),
    }),
  ],
  providers: [EmailService, PrismaService,JwtStrategy],
})
export class EmailModule {}
