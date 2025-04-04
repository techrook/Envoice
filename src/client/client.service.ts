import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
import { CONSTANT } from 'src/common/constants';

const {
  BUSINESS_PROFILE_REQUIRED,
  BUSINESS_PROFILE_REQUIRED_FOR_VIEWING,
  CLIENT_UPDATE_FORBIDDEN,
  CLIENT_NOT_FOUND,
  CLIENT_DELETE_FORBIDDEN,
} = CONSTANT;

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(userId: string, createClientDto: CreateClientDto) {
    // Ensure the user has a business profile
    const businessProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });
    if (!businessProfile) {
      throw new ForbiddenException(BUSINESS_PROFILE_REQUIRED);
    }

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        userId,
      },
    });
  }

  async getAllClients(userId: string) {
    const businessProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });
    if (!businessProfile) {
      throw new ForbiddenException(BUSINESS_PROFILE_REQUIRED_FOR_VIEWING);
    }

    return this.prisma.client.findMany({
      where: { userId },
    });
  }

  async updateClient(
    userId: string,
    clientId: string,
    updateClientDto: UpdateClientDto,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(CLIENT_NOT_FOUND);
    }

    if (client.userId !== userId) {
      throw new ForbiddenException(CLIENT_UPDATE_FORBIDDEN);
    }

    return this.prisma.client.update({
      where: { id: clientId },
      data: updateClientDto,
    });
  }

  async deleteClient(userId: string, clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(CLIENT_NOT_FOUND);
    }

    if (client.userId !== userId) {
      throw new ForbiddenException(CLIENT_DELETE_FORBIDDEN);
    }

    await this.prisma.client.delete({
      where: { id: clientId },
    });

    return { message: 'Client successfully deleted' };
  }
}
