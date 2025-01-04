import { JwtService } from '@nestjs/jwt';

export class TokenUtil {
  static signAccessToken(jwtService: JwtService, userId: string): string {
    return jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });
  }

  static signRefreshToken(jwtService: JwtService, userId: string): string {
    return jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
  }
}
