import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { createUserDto, UserSignUpDto } from 'src/auth/dto/auth.dto';
import { CrudService } from 'src/common/database/crud.service';
import { UsersMapType } from './users.mapType';
import { PrismaService } from 'src/prisma/prisma.service';

export interface IGetUserBy<T = keyof Prisma.UserWhereInput, R = string> {
    field: T;
    value: R;
  }

@Injectable()
export class UsersService extends CrudService<
Prisma.UserDelegate,
UsersMapType
>  {
    constructor(
        private readonly prisma: PrismaService,
      ) {
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
  async createUser(dto: createUserDto) {
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
}
