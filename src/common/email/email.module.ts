import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is set up
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'), // Brevo SMTP Host
          port: config.get('MAIL_PORT'), // Brevo SMTP Port
          secure: false, // Set to false for STARTTLS (port 587)
          auth: {
            user: config.get('MAIL_USERNAME'), // Your Brevo SMTP login
            pass: config.get('MAIL_PASSWORD'), // Your Brevo SMTP password
          },
          logger: true, // Enable logging for debugging
          debug: true, // Enable debug mode for troubleshooting
        },
      }),
    }),
  ],
  providers: [EmailService, PrismaService],
})
export class EmailModule {}
