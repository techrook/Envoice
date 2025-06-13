import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import EventsManager from 'src/common/events/events.manager';
import { UserSignUpDto, UserLoginDto, ResendConfirmationMailDto, ResetPasswordDto } from './dto/auth.dto';
import { PrismaClient } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    private usersService;
    private readonly eventsManager;
    private readonly jwtService;
    constructor(prisma: PrismaClient, usersService: UsersService, eventsManager: EventsManager, jwtService: JwtService);
    signUp(dto: UserSignUpDto): Promise<{
        message: string;
    }>;
    login(dto: UserLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    confirmEmail(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyToken(token: string): Promise<string>;
    requestPasswordReset(dto: ResendConfirmationMailDto): Promise<string>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private updatePassword;
}
