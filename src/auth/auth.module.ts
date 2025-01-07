import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PrismaModule, // Retain the PrismaModule from login-endpoint
    JwtModule.register({
      global: true, // Retain the JWT configuration from login-endpoint
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient],
  exports: [AuthService],
})
export class AuthModule {}
