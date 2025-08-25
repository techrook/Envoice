import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
import EventsManager from 'src/common/events/events.manager';
import { Buffer } from 'buffer';
import { Client, User } from '@prisma/client';
export declare class InvoiceService {
    private readonly prisma;
    private readonly eventsManager;
    constructor(prisma: PrismaService, eventsManager: EventsManager);
    createInvoice(userId: string, createInvoiceDto: CreateInvoiceDto): Promise<{
        items: {
            description: string;
            id: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            amount: number;
            invoiceId: string;
        }[];
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        userId: string;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        taxName: string | null;
        taxRate: number | null;
        discountType: import(".prisma/client").$Enums.DiscountType | null;
        discountValue: number | null;
        totalAmount: number;
        clientId: string;
    }>;
    getAllInvoices(userId: string): Promise<({
        items: {
            description: string;
            id: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            amount: number;
            invoiceId: string;
        }[];
        client: {
            email: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            name: string;
            userId: string;
            phone: string;
            address: string;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        userId: string;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        taxName: string | null;
        taxRate: number | null;
        discountType: import(".prisma/client").$Enums.DiscountType | null;
        discountValue: number | null;
        totalAmount: number;
        clientId: string;
    })[]>;
    getInvoiceById(userId: string, invoiceId: string): Promise<{
        items: {
            description: string;
            id: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            amount: number;
            invoiceId: string;
        }[];
        client: {
            email: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            name: string;
            userId: string;
            phone: string;
            address: string;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        userId: string;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        taxName: string | null;
        taxRate: number | null;
        discountType: import(".prisma/client").$Enums.DiscountType | null;
        discountValue: number | null;
        totalAmount: number;
        clientId: string;
    }>;
    updateInvoice(userId: string, invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<{
        items: {
            description: string;
            id: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            amount: number;
            invoiceId: string;
        }[];
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        userId: string;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        taxName: string | null;
        taxRate: number | null;
        discountType: import(".prisma/client").$Enums.DiscountType | null;
        discountValue: number | null;
        totalAmount: number;
        clientId: string;
    }>;
    deleteInvoice(userId: string, invoiceId: string): Promise<{
        message: string;
    }>;
    generate(invoice: any, user: User, client: Client): Promise<Buffer>;
}
