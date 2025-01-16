import { Injectable, OnModuleInit, OnModuleDestroy  } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('Database connection established successfully!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    log('Database disconnected  successfully!')
  }
}
