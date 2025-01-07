import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is set up
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false, // Use TLS (false for port 587)
          auth: {
            user: config.get<string>('MAIL_USERNAME'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get<string>('MAIL_FROM_NAME')}" <${config.get<string>('MAIL_FROM_ADDRESS')}>`,
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // Export the service if other modules depend on it
})
export class EmailModule {}
