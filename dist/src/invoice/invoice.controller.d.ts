import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    createInvoice(req: any, createInvoiceDto: CreateInvoiceDto): Promise<{
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
        userId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<({
        client: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            phone: string;
            address: string;
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
        userId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getInvoice(invoiceId: string, req: any): Promise<{
        client: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            phone: string;
            address: string;
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
        userId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: any, invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<{
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
        userId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: any, invoiceId: string): Promise<{
        message: string;
    }>;
}
