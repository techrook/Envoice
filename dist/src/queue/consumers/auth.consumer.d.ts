import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import AppLogger from 'src/common/log/logger.config';
import { IBaseWoker } from '../../common/interfaces/queue.interface';
import { EmailService } from 'src/common/email/email.service';
export declare class SignUpConsumer extends IBaseWoker {
    private readonly prisma;
    private readonly emailService;
    readonly log: AppLogger;
    private readonly authService;
    constructor(prisma: PrismaClient, emailService: EmailService, log: AppLogger);
    process(job: Job<any, any, string>): Promise<any>;
}
