import { Processor } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bullmq';
import { AuthService } from '../../auth/auth.service';
import AppLogger from 'src/common/log/logger.config';
import { IBaseWoker } from '../../common/interfaces/queue.interface';
import { CONSTANT } from 'src/common/constants';
import { EmailService } from 'src/common/email/email.service';
const {
  sendConfirmationMail,
  onPasswordChange,
  onPasswordReset,
  AuthQ,
  onUserLogin,
} = CONSTANT;

@Processor(AuthQ)
export class SignUpConsumer extends IBaseWoker {
  private readonly authService: AuthService;
  constructor(
    private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    public readonly log: AppLogger,
  ) {
    super(log);
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case sendConfirmationMail: {
        const { user } = job.data;
        await this.emailService.sendConfirmationEmail(user);
        break;
      }

      default: {
        this.log.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}
