import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService, UpdateUserDetailsDto } from './users.service';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,ApiParam } from '@nestjs/swagger';

interface AuthUser {
    id: string;
    username: string;
    email: string;}
@Controller('users')
@ApiTags('Users')               // Group in Swagger
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   * GET /users/me
   */
    @Get('me')
      @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – missing or invalid token',
  })
    getMe(@CurrentUser<AuthUser>() user: AuthUser) {
          return {
        message: 'Current user fetched successfully',
        data: user,
      };
    }

  /**
   * Get user by ID
   * GET /users/:id
   */
@Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  /**
   * Alternative endpoint for updating user
   * PUT /users/me/update
   */

  @Put('me/update')
    @UseInterceptors(FileInterceptor('file'))
  async updateCurrentUser(
    @Request() req,
    @Body() updateDto: UpdateUserDetailsDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.usersService.updateUserDetails(req.user.id, updateDto, file);
  }


 
  @Post('update-last-login')
  async updateLastLogin(@Request() req) {
    try {
      const userId = req.user.sub || req.user.id;
      await this.usersService.updateLastLogin(userId);
      
      return {
        message: 'Last login updated successfully',
      };
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new HttpException(
        'Failed to update last login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}