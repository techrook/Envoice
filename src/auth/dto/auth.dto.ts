import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsNotEmpty,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';


export class UserSignUpDto {
    @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
    @IsNotEmpty()
    @IsString()
    username?: string;
  
    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'strongPassword123', description: 'Password for the account', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
  }

  export class UserLoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }

  export class createUserDto {
    @IsString()
    username?: string;
  
    @IsString()
    country?: string;
  
    @IsString()
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password?: string;
  }