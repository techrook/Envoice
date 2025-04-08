import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import AppLogger from 'src/common/log/logger.config';
import { CONSTANT } from 'src/common/constants';
const { onInvoiceCreated, InvoiceQ } = CONSTANT;
@Processor(InvoiceQ)
@Injectable()
export class InvoiceConsumer {
    constructor(
        public readonly log: AppLogger,
    ) {}

    async process(job: Job): Promise<any> {
        switch (job.name) {
            case onInvoiceCreated: {
                const { userId, clientId, invoice } = job.data;
                // Handle invoice creation logic here
                this.log.log(`Processing invoice creation for user ${userId} and client ${clientId}`);
                // Add your logic to create the invoice
                break;
            }
            default:
                this.log.warn(`Unknown job name: ${job.name}`);
                break;
        }
    }
}