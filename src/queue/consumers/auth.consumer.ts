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
  AuthQ,
  onUserLogin,
  onPasswordChange,
  onPasswordReset,
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

      case onUserLogin: {
        const { userId, accessToken, refreshToken } = job.data;
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            lastLogin: new Date().toISOString(),
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        });
        break;
      }
      case 'emailConfirmed': {
        const { userId } = job.data;
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            emailVerified: true,
            verifiedToken:null,
          },
        });
        break;
      }
      case onPasswordReset: {
        const { user } = job.data;
        (await user) ? this.emailService.sendPasswordReset(user) : null;
        break;
      }

      case onPasswordChange: {
        console.log('Password Change Event', job.data);
        const { payload } = job.data;
        (await payload)
          ? this.emailService.notifyUserPasswordChange(payload)
          : null;
        break;
      }

      default: {
        this.log.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}
