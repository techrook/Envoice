// src/business-profile/dto/create-business-profile.dto.ts

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessProfileDto {
  @ApiProperty({ example: 'My Business', description: 'Name of the business' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St, City, State', description: 'Business location' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '123-456-7890', description: 'Business contact' })
  @IsString()
  @IsNotEmpty()
  contact: string;
}

export class UpdateBusinessProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  // @IsString()
  // @IsOptional()
  // logo?: string; // For logo update

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  contact?: string;
}

