import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CONSTANT, MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { User } from '@prisma/client';
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
    private prisma: PrismaService,
  ) {
    this.basePath = this.cfg.get('appRoot');
  }

  /**
   * Read and prepare email HTML template
   */
  private prepMailContent(filePath: string): string {
    return AppUtilities.readFile(`${process.cwd()}/templates/${filePath}`);
  }

  /**
   * Dispatch mail to recipient
   */
  private async dispatchMail(options: WaitlistOpts) {
    return await this.mailerService.sendMail({
      to: options.email,
      from: `${MAIL.noreply}`, // Customize sender details
      subject: options.subject,
      html: options.content,
    });
  }

  /**
   * Send confirmation email to user
   */
  async sendConfirmationEmail(user: User) {
    try {
      const token = await this.generateEmailConfirmationToken(user.id);
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

  /**
   * Generate email confirmation token
   */
  private async generateEmailConfirmationToken(userId: string): Promise<string> {
    const accessToken = AppUtilities.generateToken(32);
    await this.prisma.user.update({
      where: { id: userId },
      data: { verifiedToken: accessToken },
    });
    return accessToken;
  }
}
