import { BadRequestException, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { CONSTANT, MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { Client, Invoice, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../log/logger.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenUtil } from 'src/auth/jwttoken/token.util';

export interface WaitlistOpts {
  email: string;
  username?: string;
  subject: string;
  content: string;
}

@Injectable()
export class EmailService {
  private basePath: string;
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor(
    private cfg: ConfigService,
    private logger: AppLogger,
    private prisma: PrismaService,
  ) {
    this.basePath = this.cfg.get('appRoot');
    
    // ✅ Initialize Resend
    const apiKey = this.cfg.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY is not defined in environment variables');
      throw new Error('RESEND_API_KEY is required');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = this.cfg.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com';
    this.fromName = this.cfg.get<string>('EMAIL_FROM_NAME') || 'Envoice';
    
    this.logger.log(`✅ Email service initialized with Resend (from: ${this.fromEmail})`);
  }

  /**
   * Read and prepare email HTML template
   */
  private prepMailContent(filePath: string): string {
    return AppUtilities.readFile(`${process.cwd()}/templates/${filePath}`);
  }

  /**
   * Dispatch mail to recipient using Resend
   */
  private async dispatchMail(
    options: WaitlistOpts & { 
      attachments?: { filename: string; content: Buffer }[] 
    },
  ) {
    try {
      this.logger.log(`📧 Sending email to: ${options.email} | Subject: ${options.subject}`);
      
      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [options.email],
        subject: options.subject,
        html: options.content,
        attachments: options.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
        })) || [],
      });

      if (error) {
        this.logger.error('❌ Resend email error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`✅ Email sent successfully to ${options.email}. Resend ID: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } catch (err) {
      this.logger.error('❌ Email dispatch error:', err);
      throw new BadRequestException({
        status: 403,
        error: 'Failed to send email. Please try again later.',
      });
    }
  }

  /**
   * Send confirmation email to user
   */
  async sendConfirmationEmail(user: User) {
    try {
      const token = await this.generateEmailConfirmationToken(user.id);
      const confirmUrl = `${this.cfg.get('FRONTEND_URL')}/auth/login?token=${token}`;
      const htmlTemplate = this.prepMailContent('confirmEmail.html');
      const htmlContent = htmlTemplate.replace('{{confirmUrl}}', confirmUrl);

      const opts = {
        email: user.email,
        username: user.username,
        subject: MAIL.confirmEmail,
        content: htmlContent,
      };

      await this.dispatchMail(opts);
      this.logger.log(`✅ Confirmation email sent to ${user.email}`);
    } catch (err) {
      this.logger.error('❌ Confirmation email error:', err);
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
      console.log('🔐 Password reset URL:', resetUrl);
      
      const htmlTemplate = this.prepMailContent('reqPasswordReset.html');
      const htmlContent = htmlTemplate
        .replace(/{{resetUrl}}/g, resetUrl)
        .replace(/{{username}}/g, user.username);

      const opts = {
        email: user.email,
        username: user.username,
        subject: MAIL.passwordReset,
        content: htmlContent,
      };

      await this.dispatchMail(opts);
      this.logger.log(`✅ Password reset email sent to ${user.email}`);
    } catch (err) {
      this.logger.error('❌ Password reset email error:', err);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPs });
    }
  }

  /**
   * Notify user of password change
   */
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
      this.logger.log(`✅ Password change notification sent to ${user.email}`);
    } catch (err) {
      this.logger.error('❌ Password change notification error:', err);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPs });
    }
  }

  /**
   * Notify user of business profile creation
   */
  async notifyUserBusinessProfileCreated(user: User) {
    try {
      const htmlTemplate = this.prepMailContent('businessProfileCreated.html');
      const htmlContent = htmlTemplate
        .replace('{{username}}', AppUtilities.capitalizeFirstLetter(user.username))
        .replace('{{dashboardLink}}', `${this.cfg.get('FRONTEND_URL')}/dashboard/business-profile`);

      const opts = {
        email: user.email,
        username: user.username,
        subject: 'Business Profile Created Successfully',
        content: htmlContent,
      };

      await this.dispatchMail(opts);
      this.logger.log(`✅ Business profile notification sent to ${user.email}`);
    } catch (error) {
      this.logger.error('❌ Business profile notification error:', error);
      throw new BadRequestException({
        status: 403,
        error: error.message,
      });
    }
  }

  /**
   * Send invoice to user with PDF attachment
   */
  async sendInvoiceToUser(user: User, client: Client, invoice: Invoice, pdfBuffer: Buffer) {
    try {
      console.log('📧 Sending invoice email to:', client.email);
      
      const htmlTemplate = this.prepMailContent('invoiceNotification.html');
      const htmlContent = htmlTemplate
        .replace('{{username}}', AppUtilities.capitalizeFirstLetter(client.name))
        .replace('{{invoiceNumber}}', invoice.invoiceNumber)
        .replace('{{totalAmount}}', invoice.totalAmount.toFixed(2))
        .replace('{{status}}', `${invoice.status}`)
        .replace('{{currency}}', `${invoice.currency}`);

      // Build attachment
      const attachments = [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ];

      await this.dispatchMail({
        email: client.email,
        username: client.name,
        subject: `Invoice #${invoice.invoiceNumber} from Envoice`,
        content: htmlContent,
        attachments,
      });
      
      this.logger.log(`✅ Invoice email sent to ${client.email}`);
    } catch (error) {
      this.logger.error('❌ Invoice email error:', error);
      throw new BadRequestException({
        status: 403,
        error: CONSTANT.OOPs,
      });
    }
  }
}