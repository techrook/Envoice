import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
import { CONSTANT } from '../common/constants';
import EventsManager from 'src/common/events/events.manager';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsManager: EventsManager // Replace 'any' with the actual type of eventsManager
  ) {}

  async createInvoice(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const { clientId, items, ...invoiceData } = createInvoiceDto;

    // Check for business profile
    const businessProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!businessProfile) {
      throw new ForbiddenException(CONSTANT.BUSINESS_PROFILE_REQUIRED);
    }

    // Check for client ownership
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client || client.userId !== userId) {
      throw new ForbiddenException(CONSTANT.CLIENT_CREATE_FORBIDDEN);
    }


    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      const itemAmount = item.unitPrice * item.quantity;
      return sum + itemAmount - (itemAmount * discount) / 100;
    }, 0);

    // Create invoice along with items
    const invoice = await this.prisma.invoice.create({
      data: {
        ...invoiceData,
        issueDate:new Date(invoiceData.issueDate),
        dueDate:new Date(invoiceData.dueDate),
        invoiceNumber,
        totalAmount,
        userId, 
        clientId, 
        items: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            amount:
              item.quantity * item.unitPrice -
              (item.quantity * item.unitPrice * (item.discount || 0)) / 100,
          })),
        },
      },
      include: {
        items: true, // This will include the invoice items
      },
    });

    await this.eventsManager.onInvoiceCreated(userId,clientId, invoice);

    return invoice;
  }

  async getAllInvoices(userId: string) {
    return await this.prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
    });
  }

  async getInvoiceById(userId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: userId,
      },
      include: { client: true, items: true }, // Include related data
    });

    if (!invoice) {
      throw new NotFoundException(CONSTANT.INVOICE_NOT_FOUND);
    }

    return invoice;
  }

  async updateInvoice(userId: string, invoiceId: string, updateInvoiceDto: UpdateInvoiceDto) {
    // Fetch the invoice to ensure the user owns it
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

    // Calculate new totalAmount if items are provided
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

  async generate(invoice: any): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text(`Invoice ${invoice.invoiceNumber}`, { align: 'center' });
    doc.moveDown();

    // Dates
    doc.fontSize(12).text(`Issue Date: ${invoice.issueDate}`);
    doc.text(`Due Date: ${invoice.dueDate}`);
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('Description', 50, doc.y);
    doc.text('Qty', 300, doc.y);
    doc.text('Unit Price', 350, doc.y);
    doc.text('Discount', 430, doc.y);
    doc.text('Amount', 500, doc.y);
    doc.moveDown();
    doc.font('Helvetica');

    // Items
    invoice.items.forEach((item: any) => {
      doc.text(item.description, 50, doc.y);
      doc.text(item.quantity.toString(), 300, doc.y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 350, doc.y);
      doc.text(`$${item.discount.toFixed(2)}`, 430, doc.y);
      doc.text(`$${item.amount.toFixed(2)}`, 500, doc.y);
      doc.moveDown();
    });

    // Total
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, {
      align: 'right',
    });

    // Notes
    doc.moveDown().font('Helvetica').fontSize(10).text(`Notes: ${invoice.notes || '-'}`);

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const finalBuffer = Buffer.concat(buffers);
        resolve(finalBuffer);
      });
    });
  }
}
