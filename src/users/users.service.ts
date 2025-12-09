import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserDto, UserSignUpDto } from 'src/auth/dto/auth.dto';
import { CrudService } from 'src/common/database/crud.service';
import { UsersMapType } from './users.mapType';
import { PrismaService } from 'src/prisma/prisma.service';

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

@Injectable()
export class UsersService extends CrudService<
  Prisma.UserDelegate,
  UsersMapType
> {
  constructor(private readonly prisma: PrismaService) {
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
  async updateUserDetails(userId: string, dto: UpdateUserDetailsDto) {
    try {
      // Check if username is being updated and if it's already taken by another user
      if (dto.username) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            username: dto.username,
            NOT: {
              id: userId,
            },
          },
        });

        if (existingUser) {
          throw new Error('Username is already taken');
        }
      }

      // Remove undefined values from dto
      const updateData = Object.entries(dto).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      // Update user
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateData,
          updatedAt: new Date(),
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
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user details:', error);
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