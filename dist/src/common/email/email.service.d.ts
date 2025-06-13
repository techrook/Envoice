import { MailerService } from '@nestjs-modules/mailer';
import { Client, Invoice, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../log/logger.config';
import { PrismaService } from 'src/prisma/prisma.service';
export interface WaitlistOpts {
    email: string;
    username?: string;
    subject: string;
    content: string;
}
export declare class EmailService {
    private mailerService;
    private cfg;
    private logger;
    private prisma;
    private basePath;
    constructor(mailerService: MailerService, cfg: ConfigService, logger: AppLogger, prisma: PrismaService);
    private prepMailContent;
    private dispatchMail;
    sendConfirmationEmail(user: User): Promise<void>;
    private generateEmailConfirmationToken;
    sendPasswordReset(user: User): Promise<void>;
    notifyUserPasswordChange(user: User): Promise<void>;
    notifyUserBusinessProfileCreated(user: User): Promise<void>;
    sendInvoiceToUser(user: User, client: Client, invoice: Invoice, pdfBuffer: Buffer): Promise<void>;
}
