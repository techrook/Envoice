import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserDto, UserSignUpDto } from 'src/auth/dto/auth.dto';
import { CrudService } from 'src/common/database/crud.service';
import { UsersMapType } from './users.mapType';
import { PrismaService } from 'src/prisma/prisma.service';
import EventsManager from 'src/common/events/events.manager';
import { CONSTANT } from 'src/common/constants';

export interface IGetUserBy<T = keyof Prisma.UserWhereInput, R = string> {
  field: T;
  value: R;
}

export interface UpdateUserDetailsDto {
  username?: string;
  first_name?: string;
  last_name?: string;
  mobile?: string;
  gender?: string;
  country?: string;
  imageUrl?: string;
}

const {  } = CONSTANT;

@Injectable()
export class UsersService extends CrudService<
  Prisma.UserDelegate,
  UsersMapType
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsManager: EventsManager,) {
    super(prisma.user);
  }

  async getBy(dto: IGetUserBy) {
    return await this.prisma.user.findFirst({
      where: {
        [dto.field]: dto.value,
      },      
    });
  }

  /**
   * Create User in DB
   */
  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...dto,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async registerUser(dto: UserSignUpDto, password: string) {
    const data = {
      ...dto,
      password,
    };

    try {
      return await this.createUser(data);
    } catch (error) {
      console.log('Error Creating User', error);
      return error;
    }
  }

  async findUserByEmail(identity: string) {
    return await this.getBy({
      field: 'email',
      value: identity as string,
    });
  }

  async findUserByUsername(identity: string) {
    return await this.getBy({
      field: 'username',
      value: identity as string,
    });
  }

  async findById(id: string) {
    return this.getBy({ field: 'id', value: id });
  }

  async updatePassword(id: string, password: string) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: password,
        verifiedToken: null
      },
    });
  }

  /**
   * Update User Profile Details
   * @param userId - User ID
   * @param dto - Update data
   */
async updateUserDetails(userId: string, dto: UpdateUserDetailsDto, file?: Express.Multer.File) {
  try {
    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
        mobile: true,
        gender: true,
        country: true,
        imageUrl: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
          if (file) {
      this.eventsManager.onUserProfileUpdated(userId, file);
    }
    return updatedUser;
  } catch (error: any) {
    // Handle unique constraint error
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      throw new ConflictException("Username is already taken");
    }

    console.error("Error updating user details:", error);
    throw error;
  }
}


  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }

  /**
   * Get user profile with all details (excluding password)
   */
  async getUserProfile(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
        mobile: true,
        gender: true,
        country: true,
        imageUrl: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        provider: true,
      },
    });
  }
}