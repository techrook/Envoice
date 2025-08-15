import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
export declare class ClientService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(userId: string, createClientDto: CreateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllClients(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateClient(userId: string, clientId: string, updateClientDto: UpdateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteClient(userId: string, clientId: string): Promise<{
        message: string;
    }>;
}
