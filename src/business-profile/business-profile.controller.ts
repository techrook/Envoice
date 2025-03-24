import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import {
  CreateBusinessProfileDto,
  UpdateBusinessProfileDto,
} from './dto/create-business-profile.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard/jwt-auth.guard';

@ApiTags('Business Profile')
@ApiBearerAuth()
@Controller('business-profile')
export class BusinessProfileController {
  constructor(private businessProfileService: BusinessProfileService) {}

  @ApiOperation({ summary: 'Create Business Profile' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Req() req: any,
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
  ) {
    const userId = req.user.id;
    return this.businessProfileService.createBusinessProfile(
      userId,
      createBusinessProfileDto,
    );
  }

  @ApiOperation({ summary: 'Update Business Profile' })
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(
    @Req() req: any,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
  ) {
    const userId = req.user.id;
    return this.businessProfileService.updateBusinessProfile(
      userId,
      updateBusinessProfileDto,
    );
  }

  @ApiOperation({ summary: 'Get Business Profile' })
  @UseGuards(JwtAuthGuard)
  @Get('get')
  async get(@Req() req: any) {
    const userId = req.user.id;
    return this.businessProfileService.getBusinessProfile(userId);
  }
}
