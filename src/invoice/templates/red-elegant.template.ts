// src/invoices/templates/red-elegant.template.ts
import PDFDocument = require('pdfkit');
import axios from 'axios';
import { User, Client } from '@prisma/client';

export class RedElegantTemplate {
  constructor(private prisma: any) {}

  async generate(invoice: any, user: User, client: Client): Promise<Buffer> {
        const currency = invoice.currency 
  // || businessProfile?.currency 
  || 'USD';

    const doc = new PDFDocument({ margin: 40 });
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

      // ===========================
      // RED ELEGANT DESIGN
      // ===========================

      // White background with subtle border
      doc.rect(30, 30, 552, 732).lineWidth(0.5).stroke('#e5e7eb');

      // Top Section - Company Logo & Invoice Title
      const topY = 50;

      // Logo on left
      try {
        if (businessProfile?.logo) {
          const response = await axios.get(businessProfile.logo, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          const imageBuffer = Buffer.from(response.data as ArrayBuffer);
          
          // Red circle background for logo
          doc.circle(90, topY + 30, 35).fill('#991b1b');
          doc.image(imageBuffer, 65, topY + 10, { width: 50, height: 50 });
        }
      } catch (err) {
        console.warn('Failed to load logo:', err.message);
      }

      // Company Name below logo
      doc.fillColor('#6b7280').fontSize(11).font('Helvetica-Bold')
        .text(businessProfile?.name || 'ACME COMPANY', 50, topY + 75, { width: 150, align: 'center' });

      // INVOICE Title (Red, right side)
      doc.fillColor('#991b1b').fontSize(36).font('Helvetica-Bold')
        .text('Invoice', 350, topY, { width: 200, align: 'right' });

      // Status Badges (top-right)
      const badgeX = 420;
      const badgeY = topY + 50;

      doc.roundedRect(badgeX, badgeY, 110, 26, 5).fill(invoiceStatus.color);
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text(invoiceStatus.text, badgeX, badgeY + 7, { width: 110, align: 'center' });

      if (isBusinessCopy) {
        doc.roundedRect(badgeX, badgeY + 32, 110, 22, 5).fill('#dc2626');
        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold')
          .text('BUSINESS COPY', badgeX, badgeY + 39, { width: 110, align: 'center' });
        
        doc.save();
        doc.fontSize(50).fillColor('#991b1b', 0.04).rotate(-45, { origin: [300, 400] })
          .text('BUSINESS COPY', 100, 350, { width: 500, align: 'center' }).rotate(45);
        doc.restore();
      } else {
        doc.roundedRect(badgeX, badgeY + 32, 110, 22, 5).fill('#fef2f2');
        doc.fillColor('#991b1b').fontSize(8).font('Helvetica-Bold')
          .text('CLIENT COPY', badgeX, badgeY + 39, { width: 110, align: 'center' });
      }

      // Horizontal separator
      doc.moveTo(50, topY + 110).lineTo(560, topY + 110).lineWidth(1).stroke('#e5e7eb');

      // Two-column layout for info
      const infoY = topY + 130;

      // YOUR INFORMATION (Left)
      doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text('BUSINESS INFORMATION', 50, infoY);

      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text(businessProfile?.name || 'John Smith', 50, infoY + 25)
        .fontSize(9).text(businessProfile?.location || '123 Main Street, Anytown, USA', 50, infoY + 42)
        .text(businessProfile?.contact || 'johnsmith@example.com', 50, infoY + 57);

      // CLIENT INFORMATION (Right)
      doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text('CLIENT INFORMATION', 310, infoY);

      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text(client.name, 310, infoY + 25)
        .fontSize(9).text(client.address || '456 Elm Street, Anycity, USA', 310, infoY + 42)
        .text(client.email || 'janedoe@example.com', 310, infoY + 57);

      // Date Information
      const dateY = infoY + 90;

      // ISSUED ON (Left)
      doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text('ISSUED ON', 50, dateY);
      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text(formatDate(invoice.issueDate), 50, dateY + 20);

      // DUE DATE (Right)
      doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold')
        .text('DUE DATE', 310, dateY);
      doc.fontSize(10).font('Helvetica').fillColor('#374151')
        .text(formatDate(invoice.dueDate), 310, dateY + 20);

      // Table (Red header)
      const tableTop = dateY + 70;

      doc.rect(50, tableTop, 510, 30).fill('#991b1b');

      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text('ITEM DESCRIPTION', 60, tableTop + 10)
        .text('QTY', 320, tableTop + 10)
        .text('UNIT PRICE', 380, tableTop + 10)
        .text('TOTAL', 480, tableTop + 10);

      // Table Rows
      let y = tableTop + 40;
      let subTotal = 0;

      invoice.items?.forEach((item: any, index: number) => {
        const amount = item.amount ?? 0;
        subTotal += amount;

        const descWidth = 250;
        doc.fontSize(9).font('Helvetica');
        const descHeight = doc.heightOfString(item.description || '', { width: descWidth });
        const rowHeight = Math.max(25, descHeight + 10);

        if (index % 2 === 0) {
          doc.rect(50, y - 5, 510, rowHeight).fill('#fef2f2');
        }

        doc.fillColor('#111827').fontSize(9).font('Helvetica')
          .text(item.description || '', 60, y + 3, { width: descWidth, lineGap: 1 });

        const centerY = y + (rowHeight / 2) - 5;
        doc.text((item.quantity ?? 0).toString(), 320, centerY, { width: 50, align: 'center' });
        doc.text(`${currency}${(item.unitPrice ?? 0).toFixed(2)}`, 380, centerY, { width: 90 });
        doc.fillColor('#991b1b').font('Helvetica-Bold')
          .text(`${currency}${amount.toFixed(2)}`, 480, centerY, { width: 80 });

        y += rowHeight;
        doc.font('Helvetica');
      });

      // Separator
      doc.moveTo(50, y).lineTo(560, y).lineWidth(1).stroke('#e5e7eb');

      // Summary on right side
      y += 20;
      const summaryX = 340;

      if (invoice.discountValue && invoice.discountValue > 0) {
        const discountLabel = invoice.discountType === 'PERCENTAGE'
          ? `${(invoice.discountValue ?? 0).toFixed(2)}%`
          : `${currency}${(invoice.discountValue ?? 0).toFixed(2)}`;

        doc.fontSize(9).fillColor('#6b7280').font('Helvetica')
          .text(`Discount (${discountLabel}):`, summaryX, y, { width: 120, align: 'right' })
          .fillColor('#dc2626').font('Helvetica-Bold')
          .text(`-${currency}${(invoice.discountValue ?? 0).toFixed(2)}`, summaryX + 130, y, { width: 90, align: 'right' });
        y += 18;
      }

      if (invoice.taxRate && invoice.taxRate > 0) {
        doc.fillColor('#6b7280').font('Helvetica')
          .text(`${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%):`, summaryX, y, { width: 120, align: 'right' })
          .fillColor('#111827').font('Helvetica-Bold')
          .text(`${currency}${(invoice.taxRate ?? 0).toFixed(2)}`, summaryX + 130, y, { width: 90, align: 'right' });
        y += 25;
      } else {
        y += 10;
      }

      // Total Amount Due
      doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold')
        .text('Total Amount:', summaryX, y, { width: 120, align: 'right' })
        .fontSize(16).fillColor('#991b1b')
        .text(`${currency}${(invoice.totalAmount ?? 0).toFixed(2)}`, summaryX + 130, y, { width: 90, align: 'right' });

      // Signature Line
      y += 80;
      doc.moveTo(350, y).lineTo(530, y).lineWidth(1).stroke('#111827');
      doc.fontSize(9).fillColor('#6b7280').font('Helvetica')
        .text('Signature', 350, y + 5, { width: 180, align: 'center' });

      // Footer Message
      if (isBusinessCopy) {
        doc.fontSize(7).fillColor('#dc2626').font('Helvetica-Bold')
          .text('BUSINESS COPY - This is a copy for your records. Not valid for payment. Made with Envoice', 50, 745, { align: 'center', width: 510 });
      } else {
        doc.fontSize(8).fillColor('#6b7280').font('Helvetica')
          .text('Thank you for choosing our services! We appreciate the opportunity to work with you. Made with Envoice', 50, 735, { align: 'center', width: 510 })
          .fontSize(7)
          .text('Please make the payment within 30 days of receiving this invoice.', 50, 750, { align: 'center', width: 510 });
      }

      doc.end();
    });
  }
}