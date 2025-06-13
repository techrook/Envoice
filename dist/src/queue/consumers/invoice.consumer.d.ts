import { Job } from 'bullmq';
import AppLogger from 'src/common/log/logger.config';
import { IBaseWoker } from 'src/common/interfaces/queue.interface';
import { EmailService } from 'src/common/email/email.service';
import { PrismaClient } from '@prisma/client';
import { InvoiceService } from 'src/invoice/invoice.service';
export declare class InvoiceConsumer extends IBaseWoker {
    readonly log: AppLogger;
    private readonly prisma;
    private readonly emailService;
    private readonly invoiceService;
    constructor(log: AppLogger, prisma: PrismaClient, emailService: EmailService, invoiceService: InvoiceService);
    process(job: Job): Promise<any>;
}
