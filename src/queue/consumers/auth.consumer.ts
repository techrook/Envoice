import { Processor } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import {AuthService} from '../../auth/auth.service';
import AppLogger from 'src/common/log/logger.config';
import { IBaseWoker } from '../../common/interfaces/queue.interface';
import { CONSTANT } from 'src/common/constants';
const {
    sendConfirmationMail,
    onPasswordChange,
    onPasswordReset,
    AuthQ,
    onUserLogin,
  } = CONSTANT;

  @Processor(AuthQ)
export class SignUpConsumer extends IBaseWoker {
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
    default: {
        this.log.warn(`Unknown job name: ${job.name}`);
      }
    }
}
}