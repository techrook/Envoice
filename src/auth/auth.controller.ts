import { Body, Controller, Post } from '@nestjs/common';
import { UserSignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  authService:AuthService ;
      /**
   * User Sign up
   */

  @Post('register')
  register(@Body() dto: UserSignUpDto) {
    return this.authService.signUp(dto);
  }
}
