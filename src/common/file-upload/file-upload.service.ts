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

  // file-upload.service.ts
async uploadFile(
  file: Express.Multer.File | { buffer: Buffer | any; originalname: string },
  options?: { folder?: string; prefix?: string }
): Promise<{ url: string; filename: string }> {
  if (!file) {
    this.logger.error('Upload failed: File is missing.');
    throw new Error('Invalid file: File is required for upload.');
  }

  let buffer: Buffer; // 👈 Explicitly typed

  if (file.buffer && typeof file.buffer === 'object' && 'data' in file.buffer) {
    // Handle serialized buffer (e.g., from job queue)
    buffer = Buffer.from(file.buffer.data);
  } else if (file.buffer instanceof Buffer) {
    // Normal Multer file buffer
    buffer = file.buffer;
  } else {
    this.logger.error('Upload failed: Invalid buffer format.', { file });
    throw new Error('Invalid file: Buffer format is not supported.');
  }

  const folder = options?.folder || 'uploads';
  const prefix = options?.prefix || 'file';
  const originalname = file.originalname || 'uploaded-file';
  const nameWithoutExt = originalname.replace(/\.[^/.]+$/, '');
  const safeName = nameWithoutExt.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${prefix}-${Date.now()}-${safeName}`,
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

    uploadStream.end(buffer); // ✅ Now `buffer` is guaranteed to be a Buffer
  });
}
  
}
