import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ description: 'Name of the client' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email of the client' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the client' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Address of the client' })
  @IsString()
  address: string;
}

export class UpdateClientDto {
  @ApiProperty({ description: 'Name of the client', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email of the client', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the client', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Address of the client', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
