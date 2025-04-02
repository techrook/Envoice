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
    file: Express.Multer.File | { buffer: Buffer | any; originalname: string }
  ): Promise<{ url: string; filename: string }> {
    if (!file) {
      this.logger.error('Upload failed: File is missing.');
      throw new Error('Invalid file: File is required for upload.');
    }
    
    let buffer;
    
    // Handle both Buffer objects and serialized buffer objects
    if (file.buffer && typeof file.buffer === 'object' && file.buffer.data) {
      // If we have a serialized buffer object with data property
      buffer = Buffer.from(file.buffer.data);
    } else if (file.buffer instanceof Buffer) {
      // If we already have a proper Buffer
      buffer = file.buffer;
    } else {
      this.logger.error('Upload failed: Invalid buffer format.');
      throw new Error('Invalid file: Buffer format is not supported.');
    }
    
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
      
      // Write buffer to upload stream (not buffer.data)
      uploadStream.end(buffer);
    });
  }
  
}
