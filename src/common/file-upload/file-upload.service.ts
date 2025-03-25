import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


@Injectable()
export class FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'business-logos' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url: result.secure_url, filename: result.public_id });
        }
      }).end(file.buffer);
    });
  }
}
