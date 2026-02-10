import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
import { CONSTANT } from '../common/constants';
import EventsManager from 'src/common/events/events.manager';
import PDFDocument = require('pdfkit');
import { Buffer } from 'buffer';
import axios from 'axios';
import { Client, User } from '@prisma/client';
import { ClientService } from 'src/client/client.service';
import { BusinessProfileService } from 'src/business-profile/business-profile.service';
import { ModernTemplate } from './templates/modern.template';
import { BlueModernTemplate } from './templates/blue-modern.template';
import { RedElegantTemplate } from './templates/red-elegant.template';



@Injectable()
export class InvoiceService {

  private modernTemplate: ModernTemplate;
  private blueModernTemplate: BlueModernTemplate;
  private redElegantTemplate: RedElegantTemplate;
  constructor(
    private  clientService:ClientService,
    private  businessService:BusinessProfileService,
    private readonly prisma: PrismaService,
    private readonly eventsManager: EventsManager, // Replace 'any' with the actual type of eventsManager
  ) {
     this.modernTemplate = new ModernTemplate(prisma);
    this.blueModernTemplate = new BlueModernTemplate(prisma);
    this.redElegantTemplate = new RedElegantTemplate(prisma);
  }

  async createInvoice(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const { clientId, items, discountType, discountValue, taxRate, template, taxName, ...invoiceData } = createInvoiceDto;
  
    const businessProfile = await this.businessService.findBusinessProfileByUserId(userId)
  
    if (!businessProfile) {
      throw new ForbiddenException(CONSTANT.BUSINESS_PROFILE_REQUIRED);
    }
  
    const client = await this.clientService.findAClientById(clientId)
  
    if (!client || client.userId !== userId) {
      throw new ForbiddenException(CONSTANT.CLIENT_CREATE_FORBIDDEN);
    }
  
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
  
    const processedItems = items.map((item) => {
      const baseAmount = item.unitPrice * item.quantity;
      const discount = item.isPercentageDiscount
        ? (item.discount || 0) / 100 * baseAmount
        : item.discount || 0;
  
      return {
        ...item,
        amount: baseAmount - discount,
      };
    });
  
    const subtotal = processedItems.reduce((sum, item) => sum + item.amount, 0);
  
    let discountedTotal = subtotal;
  
    if (discountType === 'PERCENTAGE') {
      discountedTotal -= (discountValue || 0) / 100 * subtotal;
    } else if (discountType === 'FIXED') {
      discountedTotal -= discountValue || 0;
    }
  

    const taxAmount = (taxRate || 0) / 100 * discountedTotal;
    const totalAmount = discountedTotal + taxAmount;
  
    const invoice = await this.prisma.invoice.create({
      data: {
        ...invoiceData,
        issueDate: new Date(invoiceData.issueDate),
        dueDate: new Date(invoiceData.dueDate),
        invoiceNumber,
        template: template || 'MODERN',
        totalAmount,
        taxRate,
        taxName,
        discountType,
        discountValue,
        userId,
        clientId,
        items: {
          create: processedItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            isPercentageDiscount: item.isPercentageDiscount ?? true,
            amount: item.amount,
          })),
        },
      },
      include: {
        items: true,
        user: {
          include: {
            businessProfile: true,
          },
        },
        client:true,
      },
    });
    
    await this.eventsManager.onInvoiceCreated(userId, clientId, invoice);
    console.log(invoice)
  
    return invoice;
  }
  

  async getAllInvoices(userId: string) {
    return await this.prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
    });
  }

  async updateInvoice(
    userId: string,
    invoiceId: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    // Fetch the invoice to ensure the user owns it
    const invoice = await this.findInvoiceByIdAndUserId(invoiceId, userId)


    let totalAmount = invoice.totalAmount;
    if (updateInvoiceDto.items) {
      totalAmount = updateInvoiceDto.items.reduce((sum, item) => {
        const discount = item.discount || 0;
        const itemAmount = (item.unitPrice || 0) * (item.quantity || 0);
        return sum + itemAmount - (itemAmount * discount) / 100;
      }, 0);
    }

    // Update invoice and items
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...updateInvoiceDto,
        totalAmount,
        items: updateInvoiceDto.items
          ? {
              deleteMany: {}, // Remove existing items
              create: updateInvoiceDto.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount || 0,
                amount:
                  item.quantity * item.unitPrice -
                  (item.quantity * item.unitPrice * (item.discount || 0)) / 100,
              })),
            }
          : undefined,
      },
      include: { items: true }, // Return updated items
    });
     await this.eventsManager.onInvoiceCreated(userId, invoice.clientId, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(userId: string, invoiceId: string) {
    // Fetch the invoice to ensure it exists and is owned by the user
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: { items: true }, // Include related items
    });

    if (!invoice || invoice.userId !== userId) {
      throw new ForbiddenException(CONSTANT.INVOICE_DELETE_FORBIDDEN);
    }

    // Delete related InvoiceItems first
    await this.prisma.invoiceItem.deleteMany({
      where: { invoiceId: invoiceId },
    });
         
    // Delete the Invoice
    await this.prisma.invoice.delete({
      where: {      
        id: invoiceId,
      },
    });

    return { message: CONSTANT.INVOICE_DELETE_SUCCESS };
  }
   // ✅ NEW: Generate PDF with template selection
  async generate(invoice: any, user: User, client: Client): Promise<Buffer> {
    // Get the template from invoice (default to MODERN if not set)
    const template = invoice.template || 'MODERN';

    // Select the appropriate template and generate PDF
    switch (template) {
      case 'BLUE_MODERN':
        return await this.blueModernTemplate.generate(invoice, user, client);

      case 'RED_ELEGANT':
        return await this.redElegantTemplate.generate(invoice, user, client);

      case 'MODERN':
      default:
        return await this.modernTemplate.generate(invoice, user, client);
    }
  }

async getTemplates() {
    return {
      templates: [
        {
          id: 'MODERN',
          name: 'Modern',
          description: 'Professional indigo & purple gradient design',
          colorScheme: 'indigo-purple',
          bestFor: 'Tech companies, SaaS, Startups',
          features: [
            'Gradient header',
            'Modern card layouts',
            'Clean typography',
            'Purple accents',
          ],
        },
        {
  id: 'BLUE_MODERN',
  name: 'Blue Modern',
  description: 'Clean cyan & blue corporate design',
  colorScheme: 'cyan-blue',
  bestFor: 'Tech companies, Startups, Corporate',
  features: [
    'Cyan table header',
    'Blue header section',
    'Clean layout',
    'Professional styling',
  ],
},
{
  id: 'RED_ELEGANT',
  name: 'Red Elegant',
  description: 'Sophisticated maroon & white design',
  colorScheme: 'red-maroon',
  bestFor: 'Law firms, Finance, Professional services',
  features: [
    'Two-column layout',
    'Red accents',
    'Signature line',
    'Elegant typography',
  ],
},
      ],
      default: 'MODERN',
    };
  }

  // ✅ NEW: Generate template preview
  async generateTemplatePreview(
    template: string,
    userId: string,
  ): Promise<Buffer> {
    // Generate sample data
    const sampleInvoice = this.generateSampleInvoiceData(template);
    const sampleUser = await this.getSampleUserData(userId);
    const sampleClient = this.getSampleClientData();

    // Select template and generate PDF
    switch (template) {
      case 'BLUE_MODERN':
        return await this.blueModernTemplate.generate(
          sampleInvoice,
          sampleUser as any,
          sampleClient,
        );

      case 'RED_ELEGANT':
        return await this.redElegantTemplate.generate(
          sampleInvoice,
          sampleUser as any,
          sampleClient,
        );

      case 'MODERN':
      default:
        return await this.modernTemplate.generate(
          sampleInvoice,
          sampleUser as any,
          sampleClient,
        );
    }
  }

  // ✅ HELPER: Generate sample invoice data
  private generateSampleInvoiceData(template: string) {
    const templateNames = {
      MODERN: 'Modern',
      BLUE_MODERN: 'Blue_modern',
      RED_ELEGANT: 'Red_elegant',
    };

    return {
      id: 'preview-' + template.toLowerCase(),
      invoiceNumber: `SAMPLE-${template}-001`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      template: template,
      taxName: 'VAT',
      taxRate: 10,
      taxAmount: 150,
      invoiceDiscount: 50,
      discountType: 'PERCENTAGE',
      discountValue: 5,
      totalAmount: 1600,
      notes: `This is a preview of the ${templateNames[template]} template. Your actual invoice will use your business information and client details.`,
      items: [
        {
          id: '1',
          description: 'Website Design & Development',
          quantity: 1,
          unitPrice: 1200,
          discount: 0,
          amount: 1200,
        },
        {
          id: '2',
          description: 'Logo Design',
          quantity: 2,
          unitPrice: 150,
          discount: 0,
          amount: 300,
        },
        {
          id: '3',
          description: 'Content Writing (10 pages)',
          quantity: 10,
          unitPrice: 20,
          discount: 0,
          amount: 200,
        },
      ],
    };
  }


  // ✅ ADD THIS METHOD
private async getSampleUserData(userId: string) {
  // Try to get real business profile
  const businessProfile = await this.prisma.businessProfile.findFirst({
    where: { userId },
  });

  // If user has business profile, use it
  if (businessProfile) {
    return {
      id: userId,
      email: businessProfile.contact || 'user@example.com',
      businessProfile,
    };
  }

  // Otherwise, use sample data
  return {
    id: userId,
    email: 'user@example.com',
    businessProfile: {
      name: 'Your Business Name',
      location: '123 Business Street, City, State 12345',
      contact: '+1 (555) 123-4567 | info@yourbusiness.com',
      logo: null,
    },
  };
}

// ✅ ADD THIS METHOD
private getSampleClientData() {
  return {
    id: 'sample-client',
    name: 'Sample Client Company',
    email: 'client@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Client Avenue, City, State 54321',
    userId: 'sample-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ✅ ADD THIS METHOD
async generateBusinessCopyPdf(invoice: any, user: any, client: any): Promise<Buffer> {
  const template = invoice.template || 'MODERN';
  
  const invoiceWithFlag = {
    ...invoice,
    isBusinessCopy: true, // ✅ Flag for watermark
  };

  switch (template) {
    case 'BLUE_MODERN':
      return await this.blueModernTemplate.generate(invoiceWithFlag, user, client);
    case 'RED_ELEGANT':
      return await this.redElegantTemplate.generate(invoiceWithFlag, user, client);
    case 'MODERN':
    default:
      return await this.modernTemplate.generate(invoiceWithFlag, user, client);
  }
}



   async  findInvoiceByIdAndUserId(invoiceId:string, userId:string){
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: userId,
      },
      include: { client: true, items: true },
    });

    if (!invoice || invoice.userId !== userId) {
      throw new ForbiddenException(CONSTANT.INVOICE_UPDATE_FORBIDDEN);
    }

    return invoice;
  }

  async  findInvoiceById(invoiceId:string){
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
      },
      include: { client: true, items: true, user: {
        include: {
          businessProfile: true,
        },
      }, },
    });

    if (!invoice) {
      throw new ForbiddenException(CONSTANT.INVOICE_UPDATE_FORBIDDEN);
    }

    return invoice;
  }
}
  
