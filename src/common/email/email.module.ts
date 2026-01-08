import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/JWT Strategy/jwt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(), 
  
  ],
  providers: [EmailService, PrismaService, JwtStrategy, UsersService],
  exports: [EmailService], 
})
export class EmailModule {}