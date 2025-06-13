import { JwtService } from '@nestjs/jwt';
export declare class TokenUtil {
    static signAccessToken(jwtService: JwtService, userId: string): string;
    static signRefreshToken(jwtService: JwtService, userId: string): string;
    static generateResetPasswordToken(len?: number): string;
}
