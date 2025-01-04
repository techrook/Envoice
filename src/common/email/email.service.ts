import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MAIL, CONSTANT } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../log/logger.config';
export interface WaitlistOpts {
  email: string;
  username?: string;
  subject: string;
  content: string;
}

@Injectable()
export class EmailService {
  private basePath: string;
  constructor(
    private mailerService: MailerService,
    private cfg: ConfigService,
    private logger: AppLogger,
  ) {
    this.basePath = this.cfg.get('appRoot');
  }

    /**
   * Prep Html content
   */
    private prepMailContent(filePath: string) {
        return AppUtilities.readFile(`${this.basePath}/templates/${filePath}`);
      }

  /**
   * Dispatch Mail to Email Address
   */
  private async dispatchMail(options: WaitlistOpts) {
    await this.mailerService.sendMail({
      to: options.email,
      from: `${MAIL.waitListFrom} <${MAIL.noreply}>`,
      subject: options.subject,
      html: options.content,
    });
  }
  /**
   * Send Confirmation Email
   */

  async sendConfirmationEmail(user: User) {
    try {
      const token = this.generateEmailConfirmationToken(user.id);

      const confirmUrl = `${this.cfg.get('app')}/auth/login?token=${token}`;

      const htmlTemplate = this.prepMailContent('confirmEmail.html');
      const htmlContent = htmlTemplate.replace('{{confirmUrl}}', confirmUrl);

      const opts = {
        email: user.email,
        username: user.username,
        subject: MAIL.confirmEmail,
        content: htmlContent,
      };

      await this.dispatchMail(opts);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPS });
    }
  }
  private generateEmailConfirmationToken(userId: string): string {
    const access_token = AppUtilities.generateToken(32);
    return access_token;
  }
}
