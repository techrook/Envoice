import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    forwardRef(() => UsersModule),],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient,],
  exports: [AuthService]
})
export class AuthModule {}
