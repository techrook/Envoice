import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
export declare class ClientService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(userId: string, createClientDto: CreateClientDto): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }>;
    getAllClients(userId: string): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }[]>;
    updateClient(userId: string, clientId: string, updateClientDto: UpdateClientDto): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }>;
    deleteClient(userId: string, clientId: string): Promise<{
        message: string;
    }>;
}
