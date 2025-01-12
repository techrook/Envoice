import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma/prisma.service';
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
  REFRESH_TOKEN_NOTFORUSER,
} = CONSTANT;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private usersService: UsersService,
    private readonly eventsManager: EventsManager,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * User SignUp
   */
  async signUp(dto: UserSignUpDto) {
    try {
      let isExistingUser = await this.usersService.findUserByEmail(dto.email);
      if (isExistingUser) throw new ConflictException(CREDS_TAKEN);

      isExistingUser = await this.usersService.findUserByUsername(dto.username);
      if (isExistingUser) throw new ConflictException(USERNAME_TAKEN);

      const password = await AppUtilities.hashPassword(dto.password);
      const user = await this.usersService.registerUser(dto, password);
      
      this.eventsManager.onUserRegister(user);

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

      const accessToken = TokenUtil.signAccessToken(this.jwtService, user.id);
      const refreshToken = TokenUtil.signRefreshToken(this.jwtService, user.id);

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
      const userId = user.id;
      this.eventsManager.onUserLogin({
        userId,
        accessToken,
        refreshToken,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ForbiddenException(INCORRECT_CREDS);
      }
      throw error;
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken(refreshToken: string) {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOTFOUND);
    }

    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOTFORUSER);
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException(REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = TokenUtil.signAccessToken(this.jwtService, payload.sub);
    const newRefreshToken = TokenUtil.signRefreshToken(
      this.jwtService,
      payload.sub,
    );

    await this.prisma.$transaction([
      this.prisma.refreshToken.delete({ where: { token: refreshToken } }),
      this.prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: payload.sub,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      }),
    ]);

    return { accessToken, refreshToken: newRefreshToken };
  }
  async confirmEmail(token: string) {
    const userId = await this.verifyToken(token);

    this.eventsManager.onEmailConfirmation(userId);
    const accessToken = TokenUtil.signAccessToken(this.jwtService, userId);
    const refreshToken = TokenUtil.signRefreshToken(this.jwtService, userId);

    return { accessToken, refreshToken };
    
  }

  async verifyToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verifiedToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user.id;
  }
}
