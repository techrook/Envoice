import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from './dto/create-business-profile.dto';
import EventsManager from 'src/common/events/events.manager';
export declare class BusinessProfileService {
    private prisma;
    private readonly eventsManager;
    constructor(prisma: PrismaService, eventsManager: EventsManager);
    createBusinessProfile(userId: string, dto: CreateBusinessProfileDto, file?: Express.Multer.File): Promise<string>;
    updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto, file?: Express.Multer.File): Promise<string>;
    getBusinessProfile(userId: string): Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        location: string;
        contact: string;
        logo: string | null;
    }>;
}
