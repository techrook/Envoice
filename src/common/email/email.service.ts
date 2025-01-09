import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CONSTANT,MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import {  User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../log/logger.config';
import { PrismaService } from 'src/prisma/prisma.service';

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
    private  prisma:PrismaService,
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
  private async generateEmailConfirmationToken(userId: string): Promise<string> {
    const access_token = AppUtilities.generateToken(32);
    await this.prisma.user.update({
      where: { id: userId },
      data: { verifiedToken: access_token },
    });
    return access_token;
  }
}
