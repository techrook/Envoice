import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CONSTANT, MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { Client, Invoice, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../log/logger.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenUtil } from 'src/auth/jwttoken/token.util';
import { JwtService } from '@nestjs/jwt';

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
  private async dispatchMail(
    options: WaitlistOpts & { attachments?: { filename: string; content: Buffer }[] },
  ) {
    return await this.mailerService.sendMail({
      to: options.email,
      from: `${MAIL.noreply}`,
      subject: options.subject,
      html: options.content,
      attachments: options.attachments || [],
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
  private async generateEmailConfirmationToken(
    userId: string,
  ): Promise<string> {
    const accessToken = AppUtilities.generateToken(32);
    await this.prisma.user.update({
      where: { id: userId },
      data: { verifiedToken: accessToken },
    });
    return accessToken;
  }

  /**
   * Send password reset email to user
   */
  async sendPasswordReset(user: User) {
    try {
      const token = await TokenUtil.generateResetPasswordToken(16);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { verifiedToken: token },
      });
      const resetUrl = `${this.cfg.get('FRONTEND_URL')}/forgot-password?token=${token}`;
      console.log(resetUrl)
      const htmlTemplate = this.prepMailContent('reqPasswordReset.html');
      const htmlContent = htmlTemplate
  .replace(/{{resetUrl}}/g, resetUrl)
  .replace(/{{username}}/g, user.username);


      const opts = {
        subject: MAIL.passwordReset,
        content: htmlContent,
        ...user,
      };

      await this.dispatchMail(opts);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPs });
    }
  }
  async notifyUserPasswordChange(user: User) {
    try {
      const htmlTemplate = this.prepMailContent('passChangeSuccess.html');
      const htmlContent = htmlTemplate.replace(
        '{{username}}',
        AppUtilities.capitalizeFirstLetter(user.username),
      );

      const opts = {
        email: user.email,
        username: user.username,
        subject: MAIL.passswordChange,
        content: htmlContent,
      };

      await this.dispatchMail(opts);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPs });
    }
  }
  async notifyUserBusinessProfileCreated(user: User) {
    try {
      // Prepare the HTML template
      const htmlTemplate = this.prepMailContent('businessProfileCreated.html');
      
      // Replace placeholders in the template
      const htmlContent = htmlTemplate
        .replace('{{username}}', AppUtilities.capitalizeFirstLetter(user.username))
        .replace('{{dashboardLink}}', `${this.cfg.get('FRONTEND_URL')}/dashboard/business-profile`);
  
      // Prepare email options
      const opts = {
        email: user.email,
        username: user.username,
        subject: 'Business Profile Created Successfully',
        content: htmlContent,
      };
  
      // Send the email
      await this.dispatchMail(opts);
    } catch (error) {
      this.logger.error('Failed to send business profile creation notification', error);
      throw new BadRequestException({ 
        status: 403, 
        error: error.message
      });
    }
  }
  async sendInvoiceToUser(user: User,client:Client, invoice: Invoice,pdfBuffer: Buffer) {
    try {
      console.log("email",client)
      const htmlTemplate = this.prepMailContent('invoiceNotification.html');
      const htmlContent = htmlTemplate
        .replace('{{username}}', AppUtilities.capitalizeFirstLetter(client.name))
        .replace('{{invoiceNumber}}', invoice.invoiceNumber)
        .replace('{{totalAmount}}', invoice.totalAmount.toFixed(2))
        .replace('{{status}}', `${invoice.status}`);
  
      // 3. Build attachment
      const attachments = [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer, // Buffer content
        },
      ];
  
      // 4. Dispatch the email with attachment
      await this.dispatchMail({
        email: user.email,
        username: user.username,
        subject: `Invoice #${invoice.invoiceNumber} from Envoice`,
        content: htmlContent,
        attachments,
      });
      await this.dispatchMail({
        email: client.email,
        username: client.name,
        subject: `Invoice #${invoice.invoiceNumber} from Envoice`,
        content: htmlContent,
        attachments,
      });
    } catch (error) {
      this.logger.error('Failed to send invoice email', error);
      throw new BadRequestException({
        status: 403,
        error: CONSTANT.OOPs,
      });
    }
  }
  
  
}
