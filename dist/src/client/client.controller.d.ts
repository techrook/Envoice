import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createClient(req: any, createClientDto: CreateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllClients(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateClient(id: string, req: any, updateClientDto: UpdateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteClient(id: string, req: any): Promise<void>;
}
