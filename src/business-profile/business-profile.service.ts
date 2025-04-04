import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Assuming you're using Prisma
import {
  CreateBusinessProfileDto,
  UpdateBusinessProfileDto,
} from './dto/create-business-profile.dto';
import { CONSTANT } from 'src/common/constants';
import EventsManager from 'src/common/events/events.manager';

const { BUSINESS_PROFILE_EXISTS, BUSINESS_PROFILE_NOTFOUND,BUSINESS_PROFILE_CREATED,BUSINESS_PROFILE_UPDATED, } = CONSTANT;

@Injectable()
export class BusinessProfileService {
  constructor(private prisma: PrismaService,
    private readonly eventsManager: EventsManager,
  ) {}

  async createBusinessProfile(userId: string, dto: CreateBusinessProfileDto, file?: Express.Multer.File) {
    const existingProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new NotFoundException(BUSINESS_PROFILE_EXISTS);
    }

    const businessProfile = await this.prisma.businessProfile.create({
      data: {
        userId,
        logo:null,
        ...dto,
      },
    });
    if (file) {
      this.eventsManager.onBusinessProfileCreated(userId, file);
    }
    return BUSINESS_PROFILE_CREATED;
  }

  async updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto, file?: Express.Multer.File) {
    const existingProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException(BUSINESS_PROFILE_NOTFOUND);
    }

    if (file) {
      this.eventsManager.onBusinessProfileUpdated(userId, file);
    }

    const updatedProfile = await this.prisma.businessProfile.update({
      where: { userId },
      data: dto,
    });

    return BUSINESS_PROFILE_UPDATED;
  }

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
