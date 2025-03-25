import { Processor } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import { BusinessProfileService } from 'src/business-profile/business-profile.service';
import { CONSTANT } from 'src/common/constants';
import { EmailService } from 'src/common/email/email.service';
import { IBaseWoker } from 'src/common/interfaces/queue.interface';
import AppLogger from 'src/common/log/logger.config';

const { BUSINESS_PROFILE_CREATED, BusinessQ } = CONSTANT;

@Processor(BusinessQ)
export class BusinessProfileConsumer extends IBaseWoker {
  private readonly businessProfileService: BusinessProfileService
  constructor(
    
    private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    public readonly log: AppLogger,
  ) {
    super(log);
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case BUSINESS_PROFILE_CREATED: {
        const { userId, file } = job.data;
        console.log('BusinessProfileCreatedEvent', userId, file);
        break;
      }
      default: {
        this.log.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}