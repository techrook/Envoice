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

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   * GET /users/me
   */
  @Get('me')
  async getCurrentUser(@Request() req) {
    try {
      const userId = req.user.sub || req.user.id;
      
      const user = await this.usersService.getUserProfile(userId);
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new HttpException(
        error.message || 'Failed to fetch user profile',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.getUserProfile(id);
      
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
   * Update user profile details
   * PUT /users/profile/update
   */
  @Put('profile/update')
  async updateProfile(
    @Request() req,
    @Body() updateDto: UpdateUserDetailsDto,
  ) {
    try {
      const userId = req.user.sub || req.user.id;

      console.log('Updating user profile:', { userId, updateDto });

      const updatedUser = await this.usersService.updateUserDetails(
        userId,
        updateDto,
      );

      return {
        message: 'Profile updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.message === 'Username is already taken') {
        throw new HttpException(
          'Username is already taken',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        error.message || 'Failed to update profile',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Alternative endpoint for updating user
   * PUT /users/me/update
   */
  @Put('me/update')
  async updateCurrentUser(
    @Request() req,
    @Body() updateDto: UpdateUserDetailsDto,
  ) {
    return this.updateProfile(req, updateDto);
  }

  /**
   * Update user by ID (for admin use)
   * PUT /users/:id
   */
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDetailsDto,
    @Request() req,
  ) {
    try {
      const currentUserId = req.user.sub || req.user.id;

      // Check if user is updating their own profile or is admin
      if (id !== currentUserId) {
        // Add admin check here if needed
        throw new HttpException(
          'You can only update your own profile',
          HttpStatus.FORBIDDEN,
        );
      }

      const updatedUser = await this.usersService.updateUserDetails(
        id,
        updateDto,
      );

      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException(
        error.message || 'Failed to update user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload profile image
   * POST /users/upload-image
   */
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const userId = req.user.sub || req.user.id;
      
      // Construct the image URL (adjust based on your server setup)
      const imageUrl = `/uploads/profile-images/${file.filename}`;

      // Update user's imageUrl
      const updatedUser = await this.usersService.updateUserDetails(userId, {
        imageUrl,
      });

      return {
        message: 'Profile image uploaded successfully',
        imageUrl,
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new HttpException(
        error.message || 'Failed to upload image',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update last login timestamp
   * POST /users/update-last-login
   */
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