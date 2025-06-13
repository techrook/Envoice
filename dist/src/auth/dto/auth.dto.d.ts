import { PasswordFieldsDto } from './password.dto';
export declare class UserSignUpDto {
    username?: string;
    email: string;
    password: string;
}
export declare class UserLoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class CreateUserDto {
    username?: string;
    country?: string;
    email: string;
    password: string;
}
export declare class ResendConfirmationMailDto {
    email: string;
}
export declare class ResetPasswordDto extends PasswordFieldsDto {
    token: string;
}
