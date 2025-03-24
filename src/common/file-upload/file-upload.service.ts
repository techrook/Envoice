import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileUploadService {
  async uploadFile(file: Express.Multer.File): Promise<{ fileName: string; fileUrl: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Upload file to Cloudinary
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      }).end(file.buffer);
    });

    return {
      fileName: result.original_filename,
      fileUrl: result.secure_url,
    };
  }
}
