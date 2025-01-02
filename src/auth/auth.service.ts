import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { CONSTANT } from 'src/common/constants';
import { AppUtilities } from 'src/app.utilities';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserSignUpDto } from './dto/auth.dto';

const {
    CREDS_TAKEN,
    USERNAME_TAKEN,
    CONFIRM_MAIL_SENT
  } = CONSTANT;

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaClient,
        private usersService: UsersService,
    ){
        
    }
    /**
   * User SignUp
   */
  async signUp(dto: UserSignUpDto) {
    try {
      let isExistingUser = await this.usersService.findUserByEmail(dto.email);
      if (isExistingUser) throw new ConflictException(CREDS_TAKEN);

      isExistingUser = await this.usersService.findUserByUsername(dto.username);
      if (isExistingUser) throw new ConflictException(USERNAME_TAKEN);

      const password = await AppUtilities.hashPassword(dto.password);
      const user = await this.usersService.registerUser(dto, password);

      this.eventsManager.onUserRegister(user);
      return {
        message: CONFIRM_MAIL_SENT(dto.email),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(CREDS_TAKEN);
      }
      throw error;
    }
  }
}
