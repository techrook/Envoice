import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/create-invoice-dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    createInvoice(req: any, createInvoiceDto: CreateInvoiceDto): Promise<{
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
    findAll(userId: string): Promise<({
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
    getInvoice(invoiceId: string, req: any): Promise<{
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
    update(req: any, invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<{
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
    remove(req: any, invoiceId: string): Promise<{
        message: string;
    }>;
}
