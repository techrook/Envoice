import { BusinessProfileService } from './business-profile.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from './dto/create-business-profile.dto';
export declare class BusinessProfileController {
    private businessProfileService;
    constructor(businessProfileService: BusinessProfileService);
    createBusinessProfile(req: any, createBusinessProfileDto: CreateBusinessProfileDto, file: Express.Multer.File): Promise<string>;
    update(req: any, updateBusinessProfileDto: UpdateBusinessProfileDto, file: Express.Multer.File): Promise<string>;
    get(req: any): Promise<{
        id: string;
        userId: string;
        name: string;
        logo: string | null;
        location: string;
        contact: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBusinessProfile(req: any): Promise<string>;
}
