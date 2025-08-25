import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/create-client-dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createClient(req: any, createClientDto: CreateClientDto): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }>;
    getAllClients(req: any): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }[]>;
    updateClient(id: string, req: any, updateClientDto: UpdateClientDto): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        phone: string;
        address: string;
    }>;
    deleteClient(id: string, req: any): Promise<void>;
}
