import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
export class TokenUtil {
  static signAccessToken(jwtService: JwtService, userId: string): string {
    return jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '1d',
    });
  }

  static signRefreshToken(jwtService: JwtService, userId: string): string {
    return jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
  }

  static generateResetPasswordToken(len?: number): string {
    return crypto.randomBytes(len || 32).toString('hex');
  }
}
