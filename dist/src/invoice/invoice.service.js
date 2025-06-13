"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../common/constants");
const events_manager_1 = require("../common/events/events.manager");
const PDFDocument = require("pdfkit");
const buffer_1 = require("buffer");
const axios_1 = require("axios");
let InvoiceService = class InvoiceService {
    constructor(prisma, eventsManager) {
        this.prisma = prisma;
        this.eventsManager = eventsManager;
    }
    async createInvoice(userId, createInvoiceDto) {
        const { clientId, items, discountType, discountValue, taxRate, taxName, ...invoiceData } = createInvoiceDto;
        const businessProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (!businessProfile) {
            throw new common_1.ForbiddenException(constants_1.CONSTANT.BUSINESS_PROFILE_REQUIRED);
        }
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });
        if (!client || client.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.CONSTANT.CLIENT_CREATE_FORBIDDEN);
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
        }
        else if (discountType === 'FIXED') {
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
            },
        });
        await this.eventsManager.onInvoiceCreated(userId, clientId, invoice);
        return invoice;
    }
    async getAllInvoices(userId) {
        return await this.prisma.invoice.findMany({
            where: { userId },
            include: { client: true, items: true },
        });
    }
    async getInvoiceById(userId, invoiceId) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId: userId,
            },
            include: { client: true, items: true },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(constants_1.CONSTANT.INVOICE_NOT_FOUND);
        }
        return invoice;
    }
    async updateInvoice(userId, invoiceId, updateInvoiceDto) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId: userId,
            },
            include: { client: true, items: true },
        });
        if (!invoice || invoice.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.CONSTANT.INVOICE_UPDATE_FORBIDDEN);
        }
        let totalAmount = invoice.totalAmount;
        if (updateInvoiceDto.items) {
            totalAmount = updateInvoiceDto.items.reduce((sum, item) => {
                const discount = item.discount || 0;
                const itemAmount = (item.unitPrice || 0) * (item.quantity || 0);
                return sum + itemAmount - (itemAmount * discount) / 100;
            }, 0);
        }
        const updatedInvoice = await this.prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                ...updateInvoiceDto,
                totalAmount,
                items: updateInvoiceDto.items
                    ? {
                        deleteMany: {},
                        create: updateInvoiceDto.items.map((item) => ({
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount || 0,
                            amount: item.quantity * item.unitPrice -
                                (item.quantity * item.unitPrice * (item.discount || 0)) / 100,
                        })),
                    }
                    : undefined,
            },
            include: { items: true },
        });
        return updatedInvoice;
    }
    async deleteInvoice(userId, invoiceId) {
        const invoice = await this.prisma.invoice.findUnique({
            where: {
                id: invoiceId,
            },
            include: { items: true },
        });
        if (!invoice || invoice.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.CONSTANT.INVOICE_DELETE_FORBIDDEN);
        }
        await this.prisma.invoiceItem.deleteMany({
            where: { invoiceId: invoiceId },
        });
        await this.prisma.invoice.delete({
            where: {
                id: invoiceId,
            },
        });
        return { message: constants_1.CONSTANT.INVOICE_DELETE_SUCCESS };
    }
    async generate(invoice, user, client) {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        return new Promise(async (resolve, reject) => {
            doc.on('end', () => {
                const finalBuffer = buffer_1.Buffer.concat(buffers);
                resolve(finalBuffer);
            });
            doc.on('error', reject);
            let businessProfile = {};
            try {
                if (user) {
                    businessProfile = await this.prisma.businessProfile.findFirst({
                        where: { userId: user.id },
                    });
                    if (businessProfile?.logo) {
                        const response = await axios_1.default.get(businessProfile.logo, {
                            responseType: 'arraybuffer',
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            },
                        });
                        const imageBuffer = buffer_1.Buffer.from(response.data);
                        doc.image(imageBuffer, 50, 45, { width: 100 });
                    }
                }
            }
            catch (err) {
                console.warn('Failed to load logo:', err.message);
            }
            doc
                .fontSize(20)
                .text(businessProfile?.name || 'Your Business Name', 200, 50, { align: 'right' })
                .fontSize(10)
                .text(businessProfile?.location || '', { align: 'right' })
                .text(businessProfile?.contact || '', { align: 'right' })
                .text(`User ID: ${businessProfile?.userId || 'N/A'}`, { align: 'right' })
                .moveDown();
            doc
                .fontSize(16)
                .text(`Invoice #${invoice.invoiceNumber}`, { align: 'left' })
                .text(`Issue Date: ${invoice.issueDate}`, { align: 'left' })
                .text(`Due Date: ${invoice.dueDate}`, { align: 'left' })
                .moveDown();
            doc
                .fontSize(12)
                .text('Bill To:', 50, doc.y)
                .font('Helvetica-Bold')
                .text(client.name)
                .font('Helvetica')
                .text(client.email || '')
                .text(client.phone || '')
                .text(client.address || '')
                .moveDown();
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
            doc.font('Helvetica');
            let y = tableTop + 25;
            let subTotal = 0;
            invoice.items?.forEach((item) => {
                const description = item.description || '';
                const quantity = item.quantity ?? 0;
                const unitPrice = item.unitPrice ?? 0;
                const discount = item.discount ?? 0;
                const amount = item.amount ?? 0;
                subTotal += amount;
                doc
                    .text(description, 50, y)
                    .text(quantity.toString(), 260, y)
                    .text(`$${unitPrice.toFixed(2)}`, 310, y)
                    .text(`$${discount.toFixed(2)}`, 390, y)
                    .text(`$${amount.toFixed(2)}`, 470, y);
                y += itemSpacing;
            });
            y += 10;
            doc.moveTo(350, y).lineTo(550, y).stroke();
            doc.font('Helvetica');
            doc.text(`Subtotal: $${(subTotal ?? 0).toFixed(2)}`, 400, y + 10, { align: 'right' });
            if (invoice.invoiceDiscount && invoice.invoiceDiscount > 0) {
                const discountLabel = invoice.discountType === 'PERCENTAGE'
                    ? `${invoice.discountValue ?? 0}%`
                    : `$${(invoice.discountValue ?? 0).toFixed(2)}`;
                doc.text(`Discount (${discountLabel}): -$${(invoice.invoiceDiscount ?? 0).toFixed(2)}`, 400, doc.y + 5, { align: 'right' });
            }
            if (invoice.taxAmount && invoice.taxAmount > 0) {
                doc.text(`${invoice.taxName || 'Tax'} (${invoice.taxRate ?? 0}%): $${(invoice.taxAmount ?? 0).toFixed(2)}`, 400, doc.y + 5, { align: 'right' });
            }
            doc
                .font('Helvetica-Bold')
                .text(`Total: $${(invoice.totalAmount ?? 0).toFixed(2)}`, 400, doc.y + 10, {
                align: 'right',
            });
            doc
                .moveDown()
                .fontSize(10)
                .fillColor('#888888')
                .text(`Notes: ${invoice.notes || 'Thank you for your business!'}`, 50, y + 60);
            doc.end();
        });
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_manager_1.default])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map