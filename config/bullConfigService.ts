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
      useFactory: async (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>('Queue.host'),
          password: cfg.get<string>('Queue.pass'),
          port: cfg.get<number>('Queue.port'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({ name: AuthQ }),
    BullModule.registerQueue({ name: BusinessQ }),
    BullModule.registerQueue({ name: InvoiceQ }),
    QueueModule,
  ],
  exports: [BullModule],
})
export class BullConfigService {}
