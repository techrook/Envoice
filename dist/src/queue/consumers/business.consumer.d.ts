import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import { BusinessProfileService } from 'src/business-profile/business-profile.service';
import { EmailService } from 'src/common/email/email.service';
import { IBaseWoker } from 'src/common/interfaces/queue.interface';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import AppLogger from 'src/common/log/logger.config';
import { UsersService } from 'src/users/users.service';
export declare class BusinessProfileConsumer extends IBaseWoker {
    private readonly prisma;
    private readonly emailService;
    readonly log: AppLogger;
    private readonly fileUploadService;
    private readonly usersService;
    private readonly businessProfileService;
    constructor(prisma: PrismaClient, emailService: EmailService, log: AppLogger, fileUploadService: FileUploadService, usersService: UsersService, businessProfileService: BusinessProfileService);
    process(job: Job): Promise<any>;
}
