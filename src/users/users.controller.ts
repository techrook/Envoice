import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

interface AuthUser {
    id: string;
    username: string;
    email: string;
  }

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
 @Controller('users')
export class UsersController {
    constructor(){
        
    }
    @Get('me')
    getMe(@CurrentUser<AuthUser>() user: AuthUser) {
      return {
        message: 'Current user fetched successfully',
        data: user,
      };
    }
}
