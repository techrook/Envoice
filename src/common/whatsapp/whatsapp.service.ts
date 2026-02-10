// src/whatsapp/whatsapp.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Invoice } from '@prisma/client';
import { Prisma } from '@prisma/client';

type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    items: true;
    client: true;
    user: {
      include: {
        businessProfile: true;
      };
    };
  };
}>;

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private prisma: PrismaService) {}
    
  async generateInvoiceWhatsAppUrl(
    invoice: InvoiceWithRelations,
    pdfUrl: string,
  ): Promise<string> {
    try {

      const formattedPhone = this.formatPhoneNumber(
        invoice.client.phone,
        invoice.user.businessProfile?.countryCode || '+234',
      );

      console.log("formattedphone ", formattedPhone)
      const message = this.generateInvoiceMessage(invoice, pdfUrl);


      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

      this.logger.log(`Generated WhatsApp URL for invoice ${invoice.id}`);
      return whatsappUrl;
    } catch (error) {
      this.logger.error('Failed to generate WhatsApp URL:', error);
      throw new Error('Failed to generate WhatsApp link');
    }
  }

  private formatPhoneNumber(phone: string, defaultCountryCode: string): string {

    let cleaned = phone.replace(/[^\d+]/g, '');


    if (!cleaned.startsWith('+')) {

      cleaned = cleaned.replace(/^0+/, '');
      

      cleaned = `${defaultCountryCode}${cleaned}`;
    }

    return cleaned;
  }

  private generateInvoiceMessage(
    invoice: InvoiceWithRelations,
    pdfUrl: string,
  ): string {
    const businessName = invoice.user.businessProfile?.name;
    const clientName = invoice.client.name.split(' ')[0]; // First name only
    const currencySymbol = this.getCurrencySymbol(invoice.currency);

    let message = `*${businessName}*\n\n`;
    message += `Hi ${clientName},\n\n`;
    message += `📄 *Invoice: #${invoice.invoiceNumber}*\n`;
    message += `📅 Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}\n`;
    message += `⏰ Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\n`;


    message += `*Items:*\n`;
    invoice.items?.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.description}\n`;
      message += `   Qty: ${item.quantity} × ${currencySymbol}${item.unitPrice.toLocaleString()}`;
      if (item.discount > 0) {
        message += ` (Discount: ${item.isPercentageDiscount ? item.discount + '%' : currencySymbol + item.discount})`;
      }
      message += `\n   Total: ${currencySymbol}${item.amount.toLocaleString()}\n\n`;
    });

    const subtotal = invoice.items?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
    message += `*Subtotal:* ${currencySymbol}${subtotal.toLocaleString()}\n`;

    if (invoice.taxRate && invoice.taxRate > 0) {
      const taxAmount = subtotal * (invoice.taxRate / 100);
      message += `*${invoice.taxName || 'Tax'} (${invoice.taxRate}%):* ${currencySymbol}${taxAmount.toLocaleString()}\n`;
    }

    if (invoice.discountValue && invoice.discountValue > 0) {
      message += `*Discount:* ${invoice.discountType === 'PERCENTAGE' ? invoice.discountValue + '%' : currencySymbol + invoice.discountValue}\n`;
    }

    message += `*Total Amount:* ${currencySymbol}${invoice.totalAmount.toLocaleString()}\n\n`;


    message += `⬇️ *Download PDF:* ${pdfUrl}\n\n`;


    if (invoice.notes) {
      message += `📝 *Notes:*\n${invoice.notes}\n\n`;
    }

    message += `Thank you for your business! 🙏`;

    return message;
  }


  private getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      ZAR: 'R',
    };
    return symbols[currency] || currency;
  }
}