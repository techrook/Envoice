import { Body, Controller, Post } from '@nestjs/common';
import { UserSignUpDto,UserLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
      /**
   * User Sign up
   */

  @Post('register')
  register(@Body() dto: UserSignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }
}
