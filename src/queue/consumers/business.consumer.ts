import { Processor } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import { BusinessProfileService } from 'src/business-profile/business-profile.service';
import { CONSTANT } from 'src/common/constants';
import { EmailService } from 'src/common/email/email.service';
import { IBaseWoker } from 'src/common/interfaces/queue.interface';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import AppLogger from 'src/common/log/logger.config';
import { UsersService } from 'src/users/users.service';
const { onBusinessProfileCreated, BusinessQ, onBusinessProfileUpdated } = CONSTANT;

@Processor(BusinessQ)
export class BusinessProfileConsumer extends IBaseWoker {
  
  constructor(
    
    private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    public readonly log: AppLogger,
    private readonly fileUploadService: FileUploadService,
    private readonly usersService: UsersService,
    private readonly businessProfileService: BusinessProfileService
  ) {
    super(log);
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case onBusinessProfileCreated: {
        const { userId, file } = job.data;
        const user = await this.usersService.getBy({ field: 'id', value: userId });
        const fileToUpload = {
          buffer: file.buffer,
          originalname: file.originalname
        };
        let imageURLandName;
        try {
          imageURLandName = await this.fileUploadService.uploadFile(fileToUpload);
          await this.emailService.notifyUserBusinessProfileCreated(user);
        } catch (uploadError) {
          this.log.error('File upload failed');
        }
        await this.businessProfileService.updateBusinessProfile(userId, { logo: imageURLandName.url });
        break;
      }

      case onBusinessProfileUpdated: {
        const { userId, file } = job.data;
        const fileToUpload = {
          buffer: file.buffer,
          originalname: file.originalname
        };
        let imageURLandName;
        try {
          imageURLandName = await this.fileUploadService.uploadFile(fileToUpload);
        } catch (uploadError) {
          this.log.error('File upload failed');
        }
        await this.businessProfileService.updateBusinessProfile(userId, { logo: imageURLandName.url });
        break;
      }

      default: {
        this.log.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}