import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsNotEmpty,
  } from 'class-validator';

export class UserSignUpDto {
    @IsString()
    username?: string;
  
  
    @IsString()
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
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