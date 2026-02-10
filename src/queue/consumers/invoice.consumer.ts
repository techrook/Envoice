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
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { WhatsAppService } from 'src/common/whatsapp/whatsapp.service';
@Processor(InvoiceQ)
@Injectable()
export class InvoiceConsumer extends IBaseWoker {
  constructor(
    public readonly log: AppLogger,
    private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    private readonly invoiceService: InvoiceService,
    private readonly fileUploadService: FileUploadService,
    private readonly whatsappService: WhatsAppService,
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
        const pdfBuffer = await this.invoiceService.generate(
          invoice,
          user,
          client,
        ); 

        this.log.log('Uploading PDF to Cloudinary...');
      const pdfFile = {
        buffer: pdfBuffer,
        originalname: `invoice-${invoice.invoiceNumber}.pdf`,
      };

      const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4567';

      const pdfUrl = `${apiBaseUrl}/invoices/pdf/public/${invoice.id}`;//the edpoint url 
        

        this.log.log('Generating WhatsApp URL...');
      const whatsappUrl = await this.whatsappService.generateInvoiceWhatsAppUrl(
        invoice,
        pdfUrl,
      );

      await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: { whatsappUrl, pdfUrl },
      });


        await this.emailService.sendInvoiceToUser(
          user,
          client,
          invoice,
          pdfBuffer,
        );

        

        break;
      }
      default:
        this.log.warn(`Unknown job name: ${job.name}`);
        break;
    }
  }
}
