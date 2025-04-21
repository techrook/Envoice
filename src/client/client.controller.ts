import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
import { JwtAuthGuard } from '../auth/JwtAuthGuard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new client' })
  async createClient(@Req() req, @Body() createClientDto: CreateClientDto) {
    const userId = req.user.id;
    return this.clientService.createClient(userId, createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  async getAllClients(@Req() req) {
    const userId = req.user.id;
    return this.clientService.getAllClients(userId);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a client' })
  async updateClient(
    @Param('id') id: string,
    @Req() req,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const userId = req.user.id;
    return this.clientService.updateClient(userId, id, updateClientDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  async deleteClient(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    await this.clientService.deleteClient(userId, id);
  }
}
