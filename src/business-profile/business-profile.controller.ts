import { Controller, Post, Body, Param, Put, Get, UseGuards, Req } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from './dto/create-business-profile.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard/jwt-auth.guard'

@ApiTags('Business Profile')
@ApiBearerAuth() // Adds Bearer token support in Swagger
@Controller('business-profile')
export class BusinessProfileController {
  constructor(private businessProfileService: BusinessProfileService) {}

  @ApiOperation({ summary: 'Create Business Profile' })
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @Post('create')
  async create(
    @Req() req: any, // Extract user from the request (set by JwtAuthGuard)
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
  ) {
    const userId = req.user.id; // Assuming `id` is set in the JWT payload
    return this.businessProfileService.createBusinessProfile(userId, createBusinessProfileDto);
  }

  @ApiOperation({ summary: 'Update Business Profile' })
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @Put('update')
  async update(
    @Req() req: any, // Extract user from the request
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
  ) {
    const userId = req.user.id; // Get user ID from the JWT payload
    return this.businessProfileService.updateBusinessProfile(userId, updateBusinessProfileDto);
  }

  @ApiOperation({ summary: 'Get Business Profile' })
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @Get('get')
  async get(@Req() req: any) {
    const userId = req.user.id; // Get user ID from the JWT payload
    return this.businessProfileService.getBusinessProfile(userId);
  }
}
