import { IsString, MinLength } from 'class-validator';

export class PasswordFieldsDto {
  @IsString()
  @MinLength(8, {
    message: 'Password is too short. Minimal length is $constraint1 characters',
  })
  newPassword: string;

  @IsString()
  confirmNewPassword: string;
}

export class ChangePasswordDto extends PasswordFieldsDto {
  @IsString()
  currentPassword: string;
}

export class UpdatePasswordDto extends PasswordFieldsDto {}