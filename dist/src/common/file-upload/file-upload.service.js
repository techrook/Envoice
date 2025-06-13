"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let FileUploadService = FileUploadService_1 = class FileUploadService {
    constructor() {
        this.logger = new common_1.Logger(FileUploadService_1.name);
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(file) {
        if (!file) {
            this.logger.error('Upload failed: File is missing.');
            throw new Error('Invalid file: File is required for upload.');
        }
        let buffer;
        if (file.buffer && typeof file.buffer === 'object' && file.buffer.data) {
            buffer = Buffer.from(file.buffer.data);
        }
        else if (file.buffer instanceof Buffer) {
            buffer = file.buffer;
        }
        else {
            this.logger.error('Upload failed: Invalid buffer format.');
            throw new Error('Invalid file: Buffer format is not supported.');
        }
        const originalname = file.originalname || 'uploaded-file';
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'business-logos',
                public_id: `business-logo-${Date.now()}-${originalname.replace(/\s+/g, '-')}`,
                transformation: [
                    { width: 500, crop: 'limit' },
                    { quality: 'auto' },
                ],
            }, (error, result) => {
                if (error || !result) {
                    this.logger.error('Cloudinary upload failed:', error);
                    return reject(new Error('File upload to Cloudinary failed.'));
                }
                this.logger.log(`File uploaded successfully: ${result.secure_url}`);
                resolve({
                    url: result.secure_url,
                    filename: result.public_id,
                });
            });
            uploadStream.end(buffer);
        });
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = FileUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map