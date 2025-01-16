import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsManagerModule } from 'src/common/events/events.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JWT Strategy/jwt.strategy';
import { PrismaClient } from '@prisma/client';


@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EventsManagerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaClient,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
