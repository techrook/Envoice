import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File | { buffer: Buffer; originalname: string }
  ): Promise<{ url: string; filename: string }> {
    if (!file || !file.buffer) {
      this.logger.error('Upload failed: File buffer is missing.');
      throw new Error('Invalid file: Buffer is required for upload.');
    }

    const buffer = file.buffer;
    const originalname = file.originalname || 'uploaded-file';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'business-logos',
          public_id: `business-logo-${Date.now()}-${originalname.replace(/\s+/g, '-')}`,
          transformation: [
            { width: 500, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse | null, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed:', error);
            return reject(new Error('File upload to Cloudinary failed.'));
          }

          this.logger.log(`File uploaded successfully: ${result.secure_url}`);
          resolve({
            url: result.secure_url,
            filename: result.public_id,
          });
        }
      );

      // Write buffer to upload stream
      uploadStream.end(buffer);
    });
  }
}
