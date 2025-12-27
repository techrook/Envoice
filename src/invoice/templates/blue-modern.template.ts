// src/invoices/templates/blue-modern.template.ts
import PDFDocument = require('pdfkit');
import axios from 'axios';
import { User, Client } from '@prisma/client';

export class BlueModernTemplate {
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
  console.log("invoiceStatus",invoiceStatus)
  console.log("currency",currency)
  console.log("currency",currency)  
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

      // ===========================
      // BLUE MODERN DESIGN
      // ===========================

      // Top Blue Header
      doc.rect(0, 0, 612, 100).fill('#0369a1');

      // Status Badge (top-right)
      const badgeX = 470;
      const badgeY = 20;

      doc.roundedRect(badgeX, badgeY, 100, 26, 5).fill(invoiceStatus.color);
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text(invoiceStatus.text, badgeX, badgeY + 7, { width: 100, align: 'center' });

      // Business Copy / Client Copy Badge
      if (isBusinessCopy) {
        doc.roundedRect(badgeX, badgeY + 32, 100, 22, 5).fill('#dc2626');
        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold')
          .text('BUSINESS COPY', badgeX, badgeY + 39, { width: 100, align: 'center' });
        
        doc.save();
        doc.fontSize(50).fillColor('#0369a1', 0.05).rotate(-45, { origin: [300, 400] })
          .text('BUSINESS COPY', 100, 350, { width: 500, align: 'center' }).rotate(45);
        doc.restore();
      } else {
        doc.roundedRect(badgeX, badgeY + 32, 100, 22, 5).fill('#ffffff');
        doc.fillColor('#0369a1').fontSize(8).font('Helvetica-Bold')
          .text('CLIENT COPY', badgeX, badgeY + 39, { width: 100, align: 'center' });
      }

      // Logo in header
      try {
        if (businessProfile?.logo) {
          const response = await axios.get(businessProfile.logo, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          const imageBuffer = Buffer.from(response.data as ArrayBuffer);
          doc.image(imageBuffer, 50, 20, { width: 60, height: 60 });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      // Business Name in header
      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
        .text(businessProfile?.name || 'Your Business', 120, 30);

      doc.fontSize(9).font('Helvetica').fillColor('#e0f2fe')
        .text(businessProfile?.location || '', 120, 52)
        .text(businessProfile?.contact || '', 120, 65);

   

      // White background for content
      doc.fillColor('#000000');

      // Invoice Details (Dark boxes on light blue background)
      const detailsY = 130;

      // Invoice Number Box
      doc.rect(380, detailsY, 180, 30).fill('#0c4a6e');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
        .text('INVOICE NUMBER', 390, detailsY + 5);
      doc.fontSize(10).font('Helvetica')
        .text(`#${invoice.invoiceNumber}`, 390, detailsY + 17, { width: 160 });
      


      // Issue Date Box
      doc.rect(380, detailsY + 35, 85, 30).fill('#0c4a6e');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
        .text('ISSUE DATE', 385, detailsY + 40);
      doc.fontSize(9).font('Helvetica')
        .text(formatDate(invoice.issueDate), 385, detailsY + 52, { width: 75 });

      // Due Date Box
      doc.rect(475, detailsY + 35, 85, 30).fill('#0c4a6e');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
        .text('DUE DATE', 480, detailsY + 40);
      doc.fontSize(9).font('Helvetica')
        .text(formatDate(invoice.dueDate), 480, detailsY + 52, { width: 75 });

      // Bill To Section
      doc.fillColor('#0369a1').fontSize(11).font('Helvetica-Bold')
        .text('BILL TO:', 50, detailsY);

      doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold')
        .text(client.name, 50, detailsY + 20);

      doc.fontSize(9).font('Helvetica').fillColor('#475569')
        .text(client.email || '', 50, detailsY + 37)
        .text(client.phone || '', 50, detailsY + 50)
        .text(client.address || '', 50, detailsY + 63, { width: 250 });

      // Light blue separator line
      doc.moveTo(50, detailsY + 95).lineTo(560, detailsY + 95)
        .lineWidth(1).stroke('#bae6fd');

      // Table Header (Cyan background)
      const tableTop = detailsY + 115;
      doc.rect(50, tableTop, 510, 28).fill('#06b6d4');

      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 9)
        .text('QTY', 350, tableTop + 9)
        .text('PRICE', 405, tableTop + 9)
        .text('DISC', 465, tableTop + 9)
        .text('TOTAL', 510, tableTop + 9, { width: 45, align: 'right' });

      // Table Rows
      let y = tableTop + 38;
      let subTotal = 0;

      invoice.items?.forEach((item: any, index: number) => {
        const amount = item.amount ?? 0;
        subTotal += amount;

        const descWidth = 280;
        doc.fontSize(9).font('Helvetica');
        const descHeight = doc.heightOfString(item.description || '', { width: descWidth });
        const rowHeight = Math.max(25, descHeight + 10);

        if (index % 2 === 0) {
          doc.rect(50, y - 5, 510, rowHeight).fill('#f0f9ff');
        }

        doc.fillColor('#1e293b').fontSize(9).font('Helvetica')
          .text(item.description || '', 60, y + 3, { width: descWidth, lineGap: 1 });

        const centerY = y + (rowHeight / 2) - 5;
        doc.text((item.quantity ?? 0).toString(), 350, centerY, { width: 45 });
        doc.text(`${currency}${(item.unitPrice ?? 0).toFixed(2)}`, 405, centerY, { width: 50 });
        doc.text(`${currency}${(item.discount ?? 0).toFixed(2)}`, 465, centerY, { width: 35 });
        doc.fillColor('#0369a1').font('Helvetica-Bold')
          doc.text(`${currency}${amount.toFixed(2)}`
, 510, centerY, { width: 45, align: 'right' });

        y += rowHeight;
        doc.font('Helvetica');
      });

      // Blue separator
      doc.moveTo(50, y).lineTo(560, y).lineWidth(2).stroke('#0369a1');

      // Summary
      y += 25;
      const summaryX = 380;


      doc.fontSize(8).fillColor('#64748b')
  .text(`Currency: ${currency}`, summaryX, y + 40);
      

      doc.fontSize(10).fillColor('#475569')
        .text('Subtotal:', summaryX, y, { width: 100, align: 'right' })
        .fillColor('#1e293b').font('Helvetica-Bold')
        .text(`${currency}${subTotal.toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });

      if (invoice.invoiceDiscount && invoice.invoiceDiscount > 0) {
        y += 20;
        const discountLabel = invoice.discountType === 'PERCENTAGE'
          ? `${currency}${(invoice.discountValue ?? 0).toFixed(2)}%`
          : `${currency}${(invoice.discountValue ?? 0).toFixed(2)}`;

        doc.fillColor('#475569').font('Helvetica')
          .text(`Discount (${discountLabel}):`, summaryX, y, { width: 100, align: 'right' })
          .fillColor('#dc2626').font('Helvetica-Bold')
          .text(`-${currency}${(invoice.invoiceDiscount ?? 0).toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });
      }

      if (invoice.taxAmount && invoice.taxAmount > 0) {
        y += 20;
        doc.fillColor('#475569').font('Helvetica')
          .text(`${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%):`, summaryX, y, { width: 100, align: 'right' })
          .fillColor('#1e293b').font('Helvetica-Bold')
          .text(`${currency}${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 110, y, { width: 90, align: 'right' });
      }

      // Total Box (Dark Blue)
      y += 30;
      doc.rect(summaryX, y - 10, 220, 38).fill('#0c4a6e');

      doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold')
        .text('TOTAL', summaryX + 10, y + 5, { width: 80 })
        .fontSize(16)
        .text(`${currency}${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 110, y + 5, { width: 100, align: 'right' });

      // Notes
      y += 60;
      if (invoice.notes && y + 40 < 750) {
        doc.rect(50, y, 510, 60).lineWidth(1).stroke('#bae6fd');
        doc.fillColor('#0369a1').fontSize(10).font('Helvetica-Bold')
          .text('NOTES:', 60, y + 10);
        doc.fillColor('#475569').fontSize(9).font('Helvetica')
          .text(invoice.notes, 60, y + 25, { width: 490 });
      }

      // Footer
      if (isBusinessCopy) {
        doc.fontSize(8).fillColor('#dc2626').font('Helvetica-Bold')
          .text('BUSINESS COPY - This is a copy for your records. Not valid for payment.', 50, 755, { align: 'center', width: 510 });
      } else {
        doc.fontSize(8).fillColor('#64748b').font('Helvetica')
          .text('Thank you for your business!', 50, 760, { align: 'center', width: 510 });
      }

      doc.end();
    });
  }
}