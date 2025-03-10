import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordFieldsDto {
  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'New password for the account',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, {
    message: 'Password is too short. Minimal length is $constraint1 characters',
  })
  newPassword: string;

  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'Confirmation of the new password',
  })
  @IsString()
  confirmNewPassword: string;
}

export class ChangePasswordDto extends PasswordFieldsDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'Current password of the user',
  })
  @IsString()
  currentPassword: string;
}

export class UpdatePasswordDto extends PasswordFieldsDto {}