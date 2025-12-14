// src/invoices/templates/classic.template.ts
import PDFDocument = require('pdfkit');
import axios from 'axios';
import { User, Client } from '@prisma/client';

export class ClassicTemplate {
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
          if (status === 'PAID') return { text: 'PAID', color: '#16a34a', bg: '#dcfce7' }; // Green
          if (status === 'PENDING') {
            const dueDate = new Date(invoice.dueDate);
            const now = new Date();
            if (dueDate < now) return { text: 'OVERDUE', color: '#dc2626', bg: '#fee2e2' }; // Red
            return { text: 'PENDING', color: '#f59e0b', bg: '#fef3c7' }; // Amber
          }
        }
        
        const dueDate = new Date(invoice.dueDate);
        const now = new Date();
        if (dueDate < now) return { text: 'OVERDUE', color: '#dc2626', bg: '#fee2e2' };
        return { text: 'PENDING', color: '#f59e0b', bg: '#fef3c7' };
      };

      const invoiceStatus = getInvoiceStatus();

      // Format dates properly
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
      // CLASSIC TEMPLATE DESIGN
      // ===========================

      // Outer Border
      doc
        .rect(30, 30, 552, 732)
        .lineWidth(3)
        .stroke('#d97706');

      doc
        .rect(35, 35, 542, 722)
        .lineWidth(1)
        .stroke('#f59e0b');

      // ✅ TOP-RIGHT BADGES (Status + Business/Client Copy)
      let badgeX = 435;
      const badgeY = 45;

      // Status Badge (PAID/PENDING/OVERDUE)
      doc
        .roundedRect(badgeX, badgeY, 110, 28, 5)
        .fill(invoiceStatus.color);

      doc
        .fillColor('#ffffff')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(invoiceStatus.text, badgeX, badgeY + 8, {
          width: 110,
          align: 'center',
        });

      // Business Copy or Client Copy Badge
      if (isBusinessCopy) {
        doc
          .roundedRect(badgeX, badgeY + 35, 110, 24, 5)
          .lineWidth(2)
          .stroke('#ef4444')
          .fill('#fee2e2');

        doc
          .fillColor('#dc2626')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('BUSINESS COPY', badgeX, badgeY + 42, {
            width: 110,
            align: 'center',
          });

        // Diagonal watermark
        doc.save();
        doc
          .fontSize(50)
          .fillColor('#d97706', 0.05)
          .rotate(-45, { origin: [300, 400] })
          .text('BUSINESS COPY', 100, 350, {
            width: 500,
            align: 'center',
          })
          .rotate(45);
        doc.restore();
      } else {
        doc
          .roundedRect(badgeX, badgeY + 35, 110, 24, 5)
          .lineWidth(2)
          .stroke('#6366f1')
          .fill('#e0e7ff');

        doc
          .fillColor('#4338ca')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('CLIENT COPY', badgeX, badgeY + 42, {
            width: 110,
            align: 'center',
          });
      }

      // Logo (centered at top)
      try {
        if (businessProfile?.logo) {
          const response = await axios.get(businessProfile.logo, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0',
            },
          });
          const imageBuffer = Buffer.from(response.data as ArrayBuffer);
          doc.image(imageBuffer, 256, 50, { width: 100, height: 100, align: 'center' });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      // Business Name (Centered, Elegant)
      const businessNameY = businessProfile?.logo ? 160 : 60;
      doc
        .fillColor('#78350f')
        .fontSize(26)
        .font('Helvetica-Bold')
        .text(businessProfile?.name || 'Your Business', 50, businessNameY, {
          align: 'center',
          width: 500,
        });

      // Business Details (Centered)
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#92400e')
        .text(businessProfile?.location || '', 50, businessNameY + 30, {
          align: 'center',
          width: 500,
        })
        .text(businessProfile?.contact || '', 50, businessNameY + 45, {
          align: 'center',
          width: 500,
        });

      // Decorative Line
      doc
        .moveTo(150, businessNameY + 70)
        .lineTo(450, businessNameY + 70)
        .lineWidth(2)
        .stroke('#d97706');

      // INVOICE Title (Centered, Large)
      
      // Invoice Details (Boxed)
      const detailsY = businessNameY + 140;
      
      // Left box - Client Info
      doc
        .rect(50, detailsY, 240, 120)
        .lineWidth(2)
        .stroke('#d97706');

      doc
        .fillColor('#78350f')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('BILL TO:', 60, detailsY + 10);

      doc
        .fillColor('#1c1917')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(client.name, 60, detailsY + 30)
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#57534e')
        .text(client.email || '', 60, detailsY + 50)
        .text(client.phone || '', 60, detailsY + 65)
        .text(client.address || '', 60, detailsY + 80, { width: 220 });

      // Right box - Invoice Info
      doc
        .rect(310, detailsY, 240, 120)
        .lineWidth(2)
        .stroke('#d97706');

      doc
        .fillColor('#78350f')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice Number:', 320, detailsY + 15)
        .fillColor('#1c1917')
        .fontSize(9)
        .font('Helvetica')
        .text(`#${invoice.invoiceNumber}`, 320, detailsY + 30, {
          width: 220,
        });

      doc
        .fillColor('#78350f')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Issue Date:', 320, detailsY + 50)
        .fillColor('#1c1917')
        .fontSize(9)
        .font('Helvetica')
        .text(formatDate(invoice.issueDate), 320, detailsY + 65, {
          width: 220,
        });

      doc
        .fillColor('#78350f')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Due Date:', 320, detailsY + 85)
        .fillColor('#1c1917')
        .fontSize(9)
        .font('Helvetica')
        .text(formatDate(invoice.dueDate), 320, detailsY + 100, {
          width: 220,
        });

      // Table Section
      const tableTop = detailsY + 150;

      // Table Header
      doc
        .rect(50, tableTop, 500, 25)
        .fill('#f59e0b');

      doc
        .fillColor('#78350f')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 8)
        .text('QTY', 290, tableTop + 8)
        .text('PRICE', 340, tableTop + 8)
        .text('DISCOUNT', 400, tableTop + 8)
        .text('AMOUNT', 480, tableTop + 8);

      doc
        .rect(50, tableTop, 500, 25)
        .lineWidth(1)
        .stroke('#d97706');

      // Table Rows
      doc.fillColor('#000000').font('Helvetica');
      let y = tableTop + 35;
      let subTotal = 0;

      invoice.items?.forEach((item: any, index: number) => {
        const amount = item.amount ?? 0;
        subTotal += amount;

        if (index % 2 === 0) {
          doc.rect(50, y - 5, 500, 20).fill('#fffbeb');
        }

        doc
          .fillColor('#1c1917')
          .fontSize(9)
          .text(item.description || '', 60, y, { width: 210 })
          .text((item.quantity ?? 0).toString(), 290, y)
          .text(`$${(item.unitPrice ?? 0).toFixed(2)}`, 340, y)
          .text(`$${(item.discount ?? 0).toFixed(2)}`, 400, y)
          .fillColor('#78350f')
          .font('Helvetica-Bold')
          .text(`$${amount.toFixed(2)}`, 480, y);

        doc
          .rect(50, y - 5, 500, 20)
          .lineWidth(0.5)
          .stroke('#fde68a');

        y += 20;
        doc.font('Helvetica');
      });

      doc
        .moveTo(50, y)
        .lineTo(550, y)
        .lineWidth(2)
        .stroke('#d97706');

      // Summary Section
      y += 25;
      const summaryX = 340;

      doc
        .fontSize(10)
        .fillColor('#78350f')
        .font('Helvetica-Bold')
        .text('Subtotal:', summaryX, y, { width: 100, align: 'right' })
        .fillColor('#1c1917')
        .text(`$${subTotal.toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });

      if (invoice.invoiceDiscount && invoice.invoiceDiscount > 0) {
        y += 20;
        const discountLabel =
          invoice.discountType === 'PERCENTAGE'
            ? `${invoice.discountValue ?? 0}%`
            : `$${(invoice.discountValue ?? 0).toFixed(2)}`;

        doc
          .fillColor('#78350f')
          .font('Helvetica-Bold')
          .text(`Discount (${discountLabel}):`, summaryX, y, {
            width: 100,
            align: 'right',
          })
          .fillColor('#dc2626')
          .text(`-$${(invoice.invoiceDiscount ?? 0).toFixed(2)}`, summaryX + 110, y, {
            width: 90,
            align: 'right',
          });
      }

      if (invoice.taxAmount && invoice.taxAmount > 0) {
        y += 20;
        doc
          .fillColor('#78350f')
          .font('Helvetica-Bold')
          .text(
            `${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%):`,
            summaryX,
            y,
            { width: 100, align: 'right' }
          )
          .fillColor('#1c1917')
          .text(`$${(invoice.taxAmount ?? 0).toFixed(2)}`, summaryX + 110, y, {
            width: 90,
            align: 'right',
          });
      }

      // ✅ FIXED TOTAL BOX
      y += 30;
      doc
        .rect(summaryX - 10, y - 10, 210, 40)
        .lineWidth(2)
        .stroke('#d97706');

      doc
        .rect(summaryX - 8, y - 8, 206, 36)
        .fill('#fef3c7');

      doc
        .fillColor('#78350f')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('TOTAL:', summaryX, y + 5, { width: 90, align: 'right' })
        .fontSize(16)
        .text(`$${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 100, y + 5, {
          width: 100,
          align: 'right',
        });

      // Notes Section
      y += 70;
      doc
        .rect(50, y, 500, 60)
        .lineWidth(1)
        .stroke('#d97706');

      doc
        .fillColor('#78350f')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('NOTES:', 60, y + 10);

      doc
        .fillColor('#57534e')
        .fontSize(9)
        .font('Helvetica')
        .text(
          invoice.notes || 'Thank you for your business!',
          60,
          y + 25,
          { width: 480 }
        );

      // Signature Line
      doc
        .moveTo(350, 720)
        .lineTo(530, 720)
        .lineWidth(1)
        .stroke('#d97706');

      doc
        .fillColor('#78350f')
        .fontSize(8)
        .text('Authorized Signature', 350, 725, { width: 180, align: 'center' });

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
          .fillColor('#92400e')
          .font('Helvetica')
          .text(
            'This is a computer-generated invoice and is valid without signature.',
            50,
            750,
            { align: 'center', width: 500 }
          );
      }

      doc.end();
    });
  }
}