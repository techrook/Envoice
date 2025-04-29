import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import AppLogger from 'src/common/log/logger.config';
import { CONSTANT } from 'src/common/constants';
import { IBaseWoker } from 'src/common/interfaces/queue.interface';
import { EmailService } from 'src/common/email/email.service';
import { PrismaClient } from '@prisma/client';
const { onInvoiceCreated, InvoiceQ } = CONSTANT;
import { InvoiceService } from 'src/invoice/invoice.service';
@Processor(InvoiceQ)
@Injectable()
export class InvoiceConsumer extends IBaseWoker {
  constructor(
    public readonly log: AppLogger,
    private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    private readonly invoiceService: InvoiceService,
  ) {
    super(log);
  }
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case onInvoiceCreated: {
        const { userId, clientId, invoice } = job.data;

        this.log.log(
          `Processing invoice creation for user ${userId} and client ${clientId}`,
        );

        console.log(invoice)
        // 1. Fetch user and client info
        const [user, client] = await Promise.all([
          this.prisma.user.findUnique({ where: { id: userId } }),
          this.prisma.client.findUnique({ where: { id: clientId } }),
        ]);

        if (!user || !client) {
          this.log.error(`User or client not found`);
          return;
        }

        // 2. Generate PDF
        const pdfBuffer = await this.invoiceService.generate(invoice); // implement this service

        // 3. Send Email
        await this.emailService.sendInvoiceToUser(user, invoice, pdfBuffer);

        break;
      }
      default:
        this.log.warn(`Unknown job name: ${job.name}`);
        break;
    }
  }
}
