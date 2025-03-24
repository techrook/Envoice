import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
