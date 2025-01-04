import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CONSTANT } from 'src/common/constants';
import { AppUtilities } from 'src/app.utilities';
import EventsManager from 'src/common/events/events.manager';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserSignUpDto, UserLoginDto } from './dto/auth.dto';
import { TokenUtil } from './jwttoken/token.util';


import { PrismaClient } from '@prisma/client';

const {
    CREDS_TAKEN,
    USERNAME_TAKEN,
    CONFIRM_MAIL_SENT,
    INCORRECT_CREDS,
    MAIL_UNVERIFIED
  } = CONSTANT;

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaClient,
        private usersService: UsersService,
        private eventsManager:EventsManager,
    ){
        
    }
    /**
   * User SignUp
   */
  async signUp(dto: UserSignUpDto) {
    try {
      
      let isExistingUser =  await this.usersService.findUserByEmail(dto.email);
       if (isExistingUser) throw new ConflictException(CREDS_TAKEN);

      isExistingUser = await this.usersService.findUserByUsername(dto.username);
      if (isExistingUser) throw new ConflictException(USERNAME_TAKEN);

      const password = await AppUtilities.hashPassword(dto.password);
      const user = await this.usersService.registerUser(dto, password);

      // this.eventsManager.onUserRegister(user);
      return {
        message: CONFIRM_MAIL_SENT(dto.email),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(CREDS_TAKEN);
      }
      throw error;
    }    
  }

  /**
   * User Login
   */
  async login(dto: UserLoginDto) {
    try {
      const user = await this.usersService.findUserByEmail(dto.email);
      if (!user) throw new UnauthorizedException(INCORRECT_CREDS);

      const isMatch = await AppUtilities.validatePassword(
        dto.password,
        user.password,
      );

      if (!isMatch) throw new UnauthorizedException(INCORRECT_CREDS);

      if (!user.emailVerified) {
        throw new UnauthorizedException(MAIL_UNVERIFIED);
      }

      // Use TokenUtil to sign tokens
      const accessToken = TokenUtil.signAccessToken(this.jwtService, user.id);
      const refreshToken = TokenUtil.signRefreshToken(this.jwtService, user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ForbiddenException(INCORRECT_CREDS);
      }
      throw error;
    }
  }
  
}
