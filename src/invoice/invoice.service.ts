import {
  Injectable,
  NotFoundException,
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
@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsManager: EventsManager, // Replace 'any' with the actual type of eventsManager
  ) {}

  async createInvoice(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const { clientId, items, ...invoiceData } = createInvoiceDto;


    const businessProfile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!businessProfile) {
      throw new ForbiddenException(CONSTANT.BUSINESS_PROFILE_REQUIRED);
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client || client.userId !== userId) {
      throw new ForbiddenException(CONSTANT.CLIENT_CREATE_FORBIDDEN);
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;

    const totalAmount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      const itemAmount = item.unitPrice * item.quantity;
      return sum + itemAmount - (itemAmount * discount) / 100;
    }, 0);

    // Create invoice along with items
    const invoice = await this.prisma.invoice.create({
      data: {
        ...invoiceData,
        issueDate: new Date(invoiceData.issueDate),
        dueDate: new Date(invoiceData.dueDate),
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

    await this.eventsManager.onInvoiceCreated(userId, clientId, invoice);

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

  async updateInvoice(
    userId: string,
    invoiceId: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
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
  async generate(invoice: any, user: User, client: Client): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    return new Promise(async (resolve, reject) => {
      doc.on('end', () => {
        const finalBuffer = Buffer.concat(buffers);
        resolve(finalBuffer);
      });

      doc.on('error', reject);

      // Optional Logo (from Cloudinary URL)
      try {
        var businessProfile
        if (user) {
           businessProfile = await this.prisma.businessProfile.findFirst({
            where:{
              userId:user.id
            }
          })
          const response = await axios.get(`${businessProfile.logo}`, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });
          console.log(response)          
          const imageBuffer = Buffer.from(response.data, 'binary');
          doc.image(imageBuffer, 50, 45, { width: 100 });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      // Business Information (User)
      doc
        .fontSize(20)
        .text(businessProfile.name || 'Your Business Name', 200, 50, { align: 'right' })
        .fontSize(10)
        .text(businessProfile.location || '', { align: 'right' })
        .text(businessProfile.contact || '', { align: 'right' })
        .text(`User ID: ${businessProfile.userId || 'N/A'}`, { align: 'right' })
        .moveDown();

      // Invoice title
      doc
        .fontSize(16)
        .text(`Invoice #${invoice.invoiceNumber}`, { align: 'left' })
        .text(`Issue Date: ${invoice.issueDate}`)
        .text(`Due Date: ${invoice.dueDate}`)
        .moveDown();

      // Client Info
      // Client Info
      doc
        .fontSize(12)
        .text('Bill To:', 50, doc.y)
        .font('Helvetica-Bold')
        .text(client.name)
        .font('Helvetica')
        .text(client.email)
        .text(client.phone)
        .text(client.address)
        .moveDown();

      // Table Header
      const tableTop = doc.y;
      const itemSpacing = 20;
      doc.font('Helvetica-Bold');
      doc
        .text('Description', 50, tableTop)
        .text('Qty', 260, tableTop)
        .text('Unit Price', 310, tableTop)
        .text('Discount', 390, tableTop)
        .text('Amount', 470, tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Table Rows
      doc.font('Helvetica');
      let y = tableTop + 25;

      invoice.items.forEach((item: any) => {
        doc
          .text(item.description, 50, y)
          .text(item.quantity.toString(), 260, y)
          .text(`$${item.unitPrice.toFixed(2)}`, 310, y)
          .text(`$${item.discount.toFixed(2)}`, 390, y)
          .text(`$${item.amount.toFixed(2)}`, 470, y);
        y += itemSpacing;
      });

      // Summary
      y += 10;
      doc.moveTo(350, y).lineTo(550, y).stroke();
      doc
        .font('Helvetica-Bold')
        .text(`Total: $${invoice.totalAmount.toFixed(2)}`, 400, y + 10, {
          align: 'right',
        });

      // Notes
      doc
        .moveDown()
        .fontSize(10)
        .fillColor('#888888')
        .text(
          `Notes: ${invoice.notes || 'Thank you for your business!'}`,
          50,
          y + 60,
        );

      doc.end();
    });
  }
}
