import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
<<<<<<< HEAD
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PrismaModule,
    JwtModule.register({
      global: true,
    }),],
=======
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    forwardRef(() => UsersModule),],
>>>>>>> 8777fb59e156ca25f677100141cf11f5b75a3b13
  controllers: [AuthController],
  providers: [AuthService, PrismaClient,],
  exports: [AuthService]
})
export class AuthModule {}
