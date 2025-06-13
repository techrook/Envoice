export declare class FileUploadService {
    private readonly logger;
    constructor();
    uploadFile(file: Express.Multer.File | {
        buffer: Buffer | any;
        originalname: string;
    }): Promise<{
        url: string;
        filename: string;
    }>;
}
