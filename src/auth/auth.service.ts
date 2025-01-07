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
    MAIL_UNVERIFIED,
    INVALID_REFRESH_TOKEN,
    REFRESH_TOKEN_EXPIRED,
    REFRESH_TOKEN_NOTFOUND,
   REFRESH_TOKEN_NOTFORUSER
  } = CONSTANT;

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaClient,
        private usersService: UsersService,
        private eventsManager:EventsManager,
        private readonly jwtService: JwtService
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
      // Find user by email
      const user = await this.usersService.findUserByEmail(dto.email);
      if (!user) throw new UnauthorizedException(INCORRECT_CREDS);
  
      // Validate password
      const isMatch = await AppUtilities.validatePassword(
        dto.password,
        user.password,
      );
  
      if (!isMatch) throw new UnauthorizedException(INCORRECT_CREDS);
  
      if (!user.emailVerified) {
        throw new UnauthorizedException(MAIL_UNVERIFIED);
      }

      // Generate tokens
      const accessToken = TokenUtil.signAccessToken(this.jwtService, user.id);
      const refreshToken = TokenUtil.signRefreshToken(this.jwtService, user.id);
  
      // Save the refresh token to the database
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        },
      });
  
      // Return the tokens
      return { accessToken, refreshToken };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ForbiddenException(INCORRECT_CREDS);
      }
      throw error;
    }
  }
  
  

  async refreshToken(refreshToken: string) {
    // Verify the refresh token
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }
  
    // Check if the refresh token exists in the database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
  
    if (!storedToken) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOTFOUND);
    }
  
    // Ensure the token is associated with the correct user
    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOTFORUSER);
    }
  
    // Ensure the token is not expired
    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException( REFRESH_TOKEN_EXPIRED);
    }
  
    // Generate new tokens
    const accessToken = TokenUtil.signAccessToken(this.jwtService, payload.sub);
    const newRefreshToken = TokenUtil.signRefreshToken(this.jwtService, payload.sub);
  
    // Replace the old refresh token in the database with the new one
    await this.prisma.$transaction([
      this.prisma.refreshToken.delete({ where: { token: refreshToken } }),
      this.prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: payload.sub,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      }),
    ]);
  
    // Return the new tokens
    return { accessToken, refreshToken: newRefreshToken };
  }
  
}
