import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Assuming you're using Prisma
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from './dto/create-business-profile.dto';
import { PrismaClient } from '@prisma/client';
import { CONSTANT } from 'src/common/constants';

const { 
  BUSINESS_PROFILE_EXISTS,
  BUSINESS_PROFILE_NOTFOUND
} = CONSTANT                       

@Injectable()
export class BusinessProfileService {
  constructor(private prisma: PrismaService) {}

  // Create a Business Profile
  async createBusinessProfile(userId: string, dto: CreateBusinessProfileDto) {
    // Check if a business profile already exists for the user
    const existingProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new NotFoundException(BUSINESS_PROFILE_EXISTS);
    }

    const businessProfile = await this.prisma.businessProfile.create({
      data: {
        userId,
        ...dto,
      },
    });

    return businessProfile;
  }

  // Update a Business Profile
  async updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto) {
    const existingProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException(BUSINESS_PROFILE_NOTFOUND);
    }

    const updatedProfile = await this.prisma.businessProfile.update({
      where: { userId },
      data: dto,
    });

    return updatedProfile;
  }

  // Get the Business Profile
  async getBusinessProfile(userId: string) {
    const businessProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!businessProfile) {
      throw new NotFoundException(BUSINESS_PROFILE_NOTFOUND);
    }

    return businessProfile;
  }
}
