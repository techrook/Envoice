// src/invoices/templates/modern.template.ts
import PDFDocument = require('pdfkit');
import axios from 'axios';
import { User, Client } from '@prisma/client';

export class ModernTemplate {
  constructor(private prisma: any) {}

  async generate(invoice: any, user: User, client: Client): Promise<Buffer> {

        const currency = invoice.currency 
  // || businessProfile?.currency 
  || 'USD';
  
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    return new Promise(async (resolve, reject) => {
      doc.on('end', () => {
        const finalBuffer = Buffer.concat(buffers);
        resolve(finalBuffer);
      });

      doc.on('error', reject);

      const isBusinessCopy = invoice.isBusinessCopy === true;

      const getInvoiceStatus = () => {
  const status = invoice.status?.toUpperCase();
  const now = new Date();
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

  // 1️⃣ PAID is final
  if (status === 'PAID') {
    return { text: 'PAID', color: '#16a34a' };
  }

  // 2️⃣ Optional: CANCELLED / VOID
  if (status === 'CANCELLED' || status === 'VOID') {
    return { text: status, color: '#64748b' };
  }

  // 3️⃣ OVERDUE only if NOT paid
  if (dueDate && dueDate < now) {
    return { text: 'OVERDUE', color: '#dc2626' };
  }

  // 4️⃣ Default
  return { text: 'PENDING', color: '#f59e0b' };
};

      const invoiceStatus = getInvoiceStatus();

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

      // Header
      doc.rect(0, 0, 612, 150).fill('#6366f1');

      // Badges
      const badgeX = 460;
      let badgeY = 20;

      doc.roundedRect(badgeX, badgeY, 110, 28, 5).fill(invoiceStatus.color);
      doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold')
        .text(invoiceStatus.text, badgeX, badgeY + 8, { width: 110, align: 'center' });

      badgeY += 35;
      if (isBusinessCopy) {
        doc.roundedRect(badgeX, badgeY, 110, 24, 5).fill('#dc2626');
        doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
          .text('BUSINESS COPY', badgeX, badgeY + 7, { width: 110, align: 'center' });
        doc.save();
        doc.fontSize(50).fillColor('#6366f1', 0.06).rotate(-45, { origin: [300, 400] })
          .text('BUSINESS COPY', 100, 350, { width: 500, align: 'center' }).rotate(45);
        doc.restore();
      } else {
        doc.roundedRect(badgeX, badgeY, 110, 24, 5).fill('#ffffff');
        doc.fillColor('#6366f1').fontSize(9).font('Helvetica-Bold')
          .text('CLIENT COPY', badgeX, badgeY + 7, { width: 110, align: 'center' });
      }

      // Logo
      try {
        if (businessProfile?.logo) {
          const response = await axios.get(businessProfile.logo, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          const imageBuffer = Buffer.from(response.data as ArrayBuffer);
          doc.image(imageBuffer, 50, 30, { width: 80, height: 80 });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold')
        .text(businessProfile?.name || 'Your Business', 160, 40);
      doc.fontSize(10).font('Helvetica').fillColor('#e0e7ff')
        .text(businessProfile?.location || '', 160, 70)
        .text(businessProfile?.contact || '', 160, 85);
      

      doc.fillColor('#000000');

      // Details
      const detailsY = 180;
      doc.rect(350, detailsY, 200, 100).fill('#f0f4ff');
      doc.fillColor('#4338ca').fontSize(10).font('Helvetica-Bold').text('Invoice Number:', 360, detailsY + 10)
        .fillColor('#1e1b4b').fontSize(9).font('Helvetica')
        .text(`#${invoice.invoiceNumber}`, 360, detailsY + 25, { width: 180 });
      doc.fillColor('#4338ca').fontSize(10).font('Helvetica-Bold').text('Issue Date:', 360, detailsY + 45)
        .fillColor('#1e1b4b').fontSize(9).font('Helvetica')
        .text(formatDate(invoice.issueDate), 360, detailsY + 60, { width: 180 });
      doc.fillColor('#4338ca').fontSize(10).font('Helvetica-Bold').text('Due Date:', 360, detailsY + 75)
        .fillColor('#1e1b4b').fontSize(9).font('Helvetica')
        .text(formatDate(invoice.dueDate), 360, detailsY + 90, { width: 180 });

      doc.rect(50, detailsY, 250, 100).fill('#f8fafc');
      doc.fillColor('#4338ca').fontSize(12).font('Helvetica-Bold').text('BILL TO:', 60, detailsY + 10);
      doc.fillColor('#1e1b4b').fontSize(11).font('Helvetica-Bold').text(client.name, 60, detailsY + 30)
        .font('Helvetica').fontSize(9).fillColor('#64748b')
        .text(client.email || '', 60, detailsY + 45)
        .text(client.phone || '', 60, detailsY + 60)
        .text(client.address || '', 60, detailsY + 75, { width: 230 });

      // Table
      const tableTop = 310;
      doc.rect(50, tableTop, 500, 25).fill('#6366f1');
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 8)
        .text('QTY', 340, tableTop + 8)
        .text('PRICE', 385, tableTop + 8)
        .text('DISC', 445, tableTop + 8)
        .text('AMOUNT', 490, tableTop + 8, { width: 55, align: 'right' });

      // ✅ FIXED: Dynamic row heights
      let y = tableTop + 35;
      let subTotal = 0;
      let rowIndex = 0;

      invoice.items?.forEach((item: any) => {
        const amount = item.amount ?? 0;
        subTotal += amount;

        const descWidth = 270;
        doc.fontSize(9).font('Helvetica');
        const descHeight = doc.heightOfString(item.description || '', { width: descWidth });
        const rowHeight = Math.max(25, descHeight + 10);

        if (rowIndex % 2 === 0) {
          doc.rect(50, y - 5, 500, rowHeight).fill('#f8fafc');
        }

        doc.fillColor('#1e293b').fontSize(9).font('Helvetica')
          .text(item.description || '', 60, y + 3, { width: descWidth, lineGap: 1 });

        const centerY = y + (rowHeight / 2) - 5;
        doc.text((item.quantity ?? 0).toString(), 340, centerY, { width: 40 });
        doc.text(`${currency}${(item.unitPrice ?? 0).toFixed(2)}`, 385, centerY, { width: 50 });
        doc.text(`${currency}${(item.discount ?? 0).toFixed(2)}`, 445, centerY, { width: 35 });
        doc.text(`${currency}${amount.toFixed(2)}`, 490, centerY, { width: 55, align: 'right' });

        y += rowHeight;
        rowIndex++;
      });

      // Summary
      y += 20;
      const summaryX = 340;

      doc.fontSize(10).fillColor('#64748b')
        .text('Subtotal:', summaryX, y, { width: 100, align: 'right' })
        .fillColor('#1e293b')
        .text(`${currency}${subTotal.toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });

      if (invoice.invoiceDiscount && invoice.invoiceDiscount > 0) {
        y += 20;
        const discountLabel = invoice.discountType === 'PERCENTAGE'
          ? `${currency}${invoice.discountValue ?? 0}%`
          : `${currency}${(invoice.discountValue ?? 0).toFixed(2)}`;

        doc.fillColor('#64748b')
          .text(`Discount (${discountLabel}):`, summaryX, y, { width: 100, align: 'right' })
          .fillColor('#dc2626')
          .text(`-${currency}${(invoice.invoiceDiscount ?? 0).toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });
      }

      if (invoice.taxAmount && invoice.taxAmount > 0) {
        y += 20;
        doc.fillColor('#64748b')
          .text(`${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%):`, summaryX, y, { width: 100, align: 'right' })
          .fillColor('#1e293b')
          .text(`${currency}${(invoice.taxAmount ?? 0).toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });
      }

      // Total
      y += 30;
      doc.rect(summaryX, y - 10, 210, 35).fill('#6366f1');
      doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold')
        .text('TOTAL:', summaryX + 10, y + 5, { width: 80 })
        .fontSize(16)
        .text(`${currency}${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 100, y + 5, { width: 100, align: 'right' });

      // Notes
      y += 60;
      if (invoice.notes && y + 30 < 745) {
        doc.fillColor('#64748b').fontSize(9).font('Helvetica')
          .text(invoice.notes, 50, y, { width: 500 });
      }

      // Footer
      if (isBusinessCopy) {
        doc.fontSize(8).fillColor('#dc2626').font('Helvetica-Bold')
          .text('BUSINESS COPY - This is a copy for your records. Not valid for payment. Made with Envoice', 50, 745, { align: 'center', width: 500 });
      } else {
        doc.fontSize(8).fillColor('#94a3b8').font('Helvetica')
          .text('Thank you for your business . Made with Envoice', 50, 750, { align: 'center', width: 500 });
      }

      doc.end();
    });
  }
}