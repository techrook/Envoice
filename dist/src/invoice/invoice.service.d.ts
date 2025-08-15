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
            id: string;
            amount: number;
            description: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            invoiceId: string;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
        client: {
            id: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        items: {
            id: string;
            amount: number;
            description: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            invoiceId: string;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
        client: {
            id: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        items: {
            id: string;
            amount: number;
            description: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            invoiceId: string;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
            id: string;
            amount: number;
            description: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            isPercentageDiscount: boolean;
            invoiceId: string;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
