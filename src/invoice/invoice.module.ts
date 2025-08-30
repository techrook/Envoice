import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ClientModule } from 'src/client/client.module';
import { BusinessProfileModule } from 'src/business-profile/business-profile.module';

@Module({
  imports:[ClientModule, BusinessProfileModule],
  providers: [InvoiceService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
      