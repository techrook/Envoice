export declare class PasswordFieldsDto {
    newPassword: string;
    confirmNewPassword: string;
}
export declare class ChangePasswordDto extends PasswordFieldsDto {
    currentPassword: string;
}
export declare class UpdatePasswordDto extends PasswordFieldsDto {
}
