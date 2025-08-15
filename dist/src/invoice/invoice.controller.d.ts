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
    findAll(userId: string): Promise<({
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
    getInvoice(invoiceId: string, req: any): Promise<{
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
    remove(req: any, invoiceId: string): Promise<{
        message: string;
    }>;
}
