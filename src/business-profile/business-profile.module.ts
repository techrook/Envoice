import { Module } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService, PrismaService],
})
export class BusinessProfileModule {}
