import { BusinessProfileService } from './business-profile.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from './dto/create-business-profile.dto';
export declare class BusinessProfileController {
    private businessProfileService;
    constructor(businessProfileService: BusinessProfileService);
    createBusinessProfile(req: any, createBusinessProfileDto: CreateBusinessProfileDto, file: Express.Multer.File): Promise<string>;
    update(req: any, updateBusinessProfileDto: UpdateBusinessProfileDto, file: Express.Multer.File): Promise<string>;
    get(req: any): Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        name: string;
        userId: string;
        location: string;
        contact: string;
        logo: string | null;
    }>;
    deleteBusinessProfile(req: any): Promise<string>;
}
