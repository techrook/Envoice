import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserSignUpDto,UserLoginDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    if (!tokens) throw new UnauthorizedException('Invalid refresh token');
    return tokens;
  }


  @Get('confirm-email')
  confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  // @Get('/callback')
  // @UseGuards(AuthGuard('twitter'))
  // async twitterAuthRedirect(@Req() req) {
  //   console.log(req.user);
  //   return this.authService.socialLogin(req.user);
  // }
}
