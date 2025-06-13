import { UserSignUpDto, UserLoginDto, RefreshTokenDto, ResendConfirmationMailDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { PasswordFieldsDto } from './dto/password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: UserSignUpDto): Promise<{
        message: string;
    }>;
    login(loginDto: UserLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    confirmEmail(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    requestPasswordReset(dto: ResendConfirmationMailDto): Promise<string>;
    resetPassword(dto: PasswordFieldsDto, token: string): Promise<{
        message: string;
    }>;
}
