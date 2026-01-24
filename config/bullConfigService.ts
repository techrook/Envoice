import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueModule } from 'src/queue/queue.module';
import { CONSTANT } from 'src/common/constants';
const { AuthQ,BusinessQ,InvoiceQ, } = CONSTANT;

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          url: cfg.get<string>('REDIS_URL'),
        },
      }),
    }),
    

    BullModule.registerQueue({ name: AuthQ }),
    BullModule.registerQueue({ name: BusinessQ }),
    BullModule.registerQueue({ name: InvoiceQ }),
    QueueModule,
  ],
  exports: [BullModule],
})
export class BullConfigService {}
