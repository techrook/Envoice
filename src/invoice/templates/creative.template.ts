// src/invoices/templates/creative.template.ts
import PDFDocument = require('pdfkit');
import axios from 'axios';
import { User, Client } from '@prisma/client';

export class CreativeTemplate {
  constructor(private prisma: any) {}

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

      // ✅ CHECK FOR BUSINESS COPY FLAG
      const isBusinessCopy = invoice.isBusinessCopy === true;

      // ✅ DETERMINE INVOICE STATUS
      const getInvoiceStatus = () => {
        if (invoice.status) {
          const status = invoice.status.toUpperCase();
          if (status === 'PAID') return { text: 'PAID', color: '#16a34a' }; // Green
          if (status === 'PENDING') {
            const dueDate = new Date(invoice.dueDate);
            const now = new Date();
            if (dueDate < now) return { text: 'OVERDUE', color: '#dc2626' }; // Red
            return { text: 'PENDING', color: '#f59e0b' }; // Amber
          }
        }
        
        const dueDate = new Date(invoice.dueDate);
        const now = new Date();
        if (dueDate < now) return { text: 'OVERDUE', color: '#dc2626' };
        return { text: 'PENDING', color: '#f59e0b' };
      };

      const invoiceStatus = getInvoiceStatus();

      // ✅ DATE FORMATTER
      const formatDate = (dateString: string) => {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        } catch (e) {
          return dateString;
        }
      };

      // Fetch Business Profile
      let businessProfile: any = {};
      try {
        if (user) {
          businessProfile = await this.prisma.businessProfile.findFirst({
            where: { userId: user.id },
          });
        }
      } catch (err) {
        console.warn('Failed to load business profile:', err.message);
      }

      // ===========================
      // CREATIVE TEMPLATE DESIGN
      // ===========================

      // Decorative circles
      doc
        .circle(550, 30, 40)
        .fill('#fce7f3');

      doc
        .circle(520, 50, 25)
        .fill('#fbcfe8');

      doc
        .circle(560, 70, 15)
        .fill('#f9a8d4');

      // Top accent bar
      doc
        .rect(0, 0, 612, 10)
        .fill('#ec4899');

      // ✅ TOP-RIGHT BADGES
      const badgeX = 400;
      let badgeY = 20;

      // Status Badge
      doc
        .roundedRect(badgeX, badgeY, 100, 28, 5)
        .fill(invoiceStatus.color);

      doc
        .fillColor('#ffffff')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(invoiceStatus.text, badgeX, badgeY + 8, {
          width: 100,
          align: 'center',
        });

      // Business/Client Copy Badge
      badgeY += 35;
      if (isBusinessCopy) {
        doc
          .roundedRect(badgeX, badgeY, 100, 24, 5)
          .fill('#dc2626');

        doc
          .fillColor('#ffffff')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('BUSINESS COPY', badgeX, badgeY + 7, {
            width: 100,
            align: 'center',
          });

        // Diagonal watermark
        doc.save();
        doc
          .fontSize(50)
          .fillColor('#ec4899', 0.05)
          .rotate(-45, { origin: [300, 400] })
          .text('BUSINESS COPY', 100, 350, {
            width: 500,
            align: 'center',
          })
          .rotate(45);
        doc.restore();
      } else {
        doc
          .roundedRect(badgeX, badgeY, 100, 24, 5)
          .fill('#fda4af');

        doc
          .fillColor('#ffffff')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('CLIENT COPY', badgeX, badgeY + 7, {
            width: 100,
            align: 'center',
          });
      }

      // Logo
      try {
        if (businessProfile?.logo) {
          const response = await axios.get(businessProfile.logo, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0',
            },
          });
          const imageBuffer = Buffer.from(response.data as ArrayBuffer);
          
          doc
            .circle(90, 70, 45)
            .fill('#fce7f3');
          
          doc.image(imageBuffer, 55, 35, { width: 70, height: 70 });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      // Business Name
      const businessStartX = businessProfile?.logo ? 150 : 50;
      doc
        .fillColor('#be185d')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(businessProfile?.name || 'Your Business', businessStartX, 45);

      // Business Details
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#9f1239')
        .text(businessProfile?.location || '', businessStartX, 72)
        .text(businessProfile?.contact || '', businessStartX, 85);

      // INVOICE Badge
      

      // Invoice Details Cards
      const detailsY = 140;

      // Client Info Card
      doc
        .roundedRect(50, detailsY, 240, 110, 10)
        .fill('#fff1f2');

      doc
        .roundedRect(50, detailsY, 240, 35, 10)
        .fill('#fda4af');

      doc
        .fillColor('#ffffff')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('BILLED TO', 60, detailsY + 12);

      doc
        .fillColor('#881337')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(client.name, 60, detailsY + 45)
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#9f1239')
        .text(client.email || '', 60, detailsY + 62)
        .text(client.phone || '', 60, detailsY + 75)
        .text(client.address || '', 60, detailsY + 88, { width: 220 });

      // Invoice Info Card
      doc
        .roundedRect(310, detailsY, 240, 110, 10)
        .fill('#fff1f2');

      doc
        .roundedRect(310, detailsY, 240, 35, 10)
        .fill('#fda4af');

      doc
        .fillColor('#ffffff')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('INVOICE DETAILS', 320, detailsY + 12);

      doc
        .fillColor('#9f1239')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Invoice #:', 320, detailsY + 48)
        .fillColor('#881337')
        .font('Helvetica')
        .text(`${invoice.invoiceNumber}`, 320, detailsY + 62, { width: 220 });

      doc
        .fillColor('#9f1239')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Issue Date:', 320, detailsY + 78)
        .fillColor('#881337')
        .font('Helvetica')
        .text(formatDate(invoice.issueDate), 385, detailsY + 78, { width: 155 });

      doc
        .fillColor('#9f1239')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Due Date:', 320, detailsY + 93)
        .fillColor('#881337')
        .font('Helvetica')
        .text(formatDate(invoice.dueDate), 385, detailsY + 93, { width: 155 });

      // Table Section
      const tableTop = 280;

      doc
        .roundedRect(50, tableTop, 500, 28, 8)
        .fill('#ec4899');

      doc
        .fillColor('#ffffff')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 10)
        .text('QTY', 290, tableTop + 10)
        .text('PRICE', 340, tableTop + 10)
        .text('DISCOUNT', 400, tableTop + 10)
        .text('AMOUNT', 480, tableTop + 10);

      let y = tableTop + 38;
      let subTotal = 0;

      invoice.items?.forEach((item: any, index: number) => {
        const amount = item.amount ?? 0;
        subTotal += amount;

        if (index % 2 === 0) {
          doc
            .roundedRect(50, y - 5, 500, 22, 5)
            .fill('#fef2f2');
        }

        doc
          .fillColor('#4c0519')
          .fontSize(9)
          .font('Helvetica')
          .text(item.description || '', 60, y, { width: 210 })
          .text((item.quantity ?? 0).toString(), 290, y)
          .text(`$${(item.unitPrice ?? 0).toFixed(2)}`, 340, y)
          .text(`$${(item.discount ?? 0).toFixed(2)}`, 400, y)
          .fillColor('#be185d')
          .font('Helvetica-Bold')
          .text(`$${amount.toFixed(2)}`, 480, y);

        y += 22;
        doc.font('Helvetica');
      });

      // Summary Section
      y += 20;
      const summaryX = 330;

      doc
        .roundedRect(summaryX - 10, y - 10, 230, 120, 10)
        .fill('#fff1f2');

      doc
        .fontSize(10)
        .fillColor('#9f1239')
        .font('Helvetica')
        .text('Subtotal:', summaryX, y, { width: 100, align: 'right' })
        .fillColor('#4c0519')
        .font('Helvetica-Bold')
        .text(`$${subTotal.toFixed(2)}`, summaryX + 110, y, { width: 100, align: 'right' });

      if (invoice.invoiceDiscount && invoice.invoiceDiscount > 0) {
        y += 20;
        const discountLabel =
          invoice.discountType === 'PERCENTAGE'
            ? `${invoice.discountValue ?? 0}%`
            : `$${(invoice.discountValue ?? 0).toFixed(2)}`;

        doc
          .fillColor('#9f1239')
          .font('Helvetica')
          .text(`Discount (${discountLabel}):`, summaryX, y, {
            width: 100,
            align: 'right',
          })
          .fillColor('#dc2626')
          .font('Helvetica-Bold')
          .text(`-$${(invoice.invoiceDiscount ?? 0).toFixed(2)}`, summaryX + 110, y, {
            width: 100,
            align: 'right',
          });
      }

      if (invoice.taxAmount && invoice.taxAmount > 0) {
        y += 20;
        doc
          .fillColor('#9f1239')
          .font('Helvetica')
          .text(
            `${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%):`,
            summaryX,
            y,
            { width: 100, align: 'right' }
          )
          .fillColor('#4c0519')
          .font('Helvetica-Bold')
          .text(`$${(invoice.taxAmount ?? 0).toFixed(2)}`, summaryX + 110, y, {
            width: 100,
            align: 'right',
          });
      }

      y += 25;
      doc
        .moveTo(summaryX, y)
        .lineTo(summaryX + 210, y)
        .lineWidth(2)
        .stroke('#f9a8d4');

      // ✅ FIXED TOTAL BOX
      y += 15;
      doc
        .roundedRect(summaryX, y - 5, 210, 35, 8)
        .fill('#ec4899');

      doc
        .fillColor('#ffffff')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('TOTAL', summaryX + 10, y + 7, { width: 80, align: 'left' })
        .fontSize(18)
        .text(`$${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 100, y + 5, {
          width: 100,
          align: 'right',
        });

      // Notes Section
      y += 60;
      doc
        .roundedRect(50, y, 500, 70, 10)
        .lineWidth(2)
        .stroke('#fda4af');

      doc
        .fillColor('#be185d')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('NOTES', 60, y + 12);

      doc
        .fillColor('#9f1239')
        .fontSize(9)
        .font('Helvetica')
        .text(
          invoice.notes || 'Thank you for your business!',
          60,
          y + 30,
          { width: 480 }
        );

      // Decorative circles
      doc
        .circle(70, 740, 25)
        .fill('#fce7f3');

      doc
        .circle(50, 720, 15)
        .fill('#fbcfe8');

      // Footer
      if (isBusinessCopy) {
        doc
          .fontSize(8)
          .fillColor('#dc2626')
          .font('Helvetica-Bold')
          .text(
            'BUSINESS COPY - This is a copy for your records. Not valid for payment.',
            50,
            745,
            { align: 'center', width: 500 }
          );
      } else {
        doc
          .fontSize(8)
          .fillColor('#9f1239')
          .font('Helvetica')
          .text(
            'Created with care | This invoice is valid without signature',
            50,
            750,
            { align: 'center', width: 500 }
          );
      }

      // Bottom accent bar
      doc
        .rect(0, 782, 612, 10)
        .fill('#ec4899');

      doc.end();
    });
  }
}