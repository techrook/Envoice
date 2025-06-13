export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED = "FIXED"
}
declare class InvoiceItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    isPercentageDiscount?: boolean;
}
export declare class CreateInvoiceDto {
    clientId: string;
    issueDate: string;
    dueDate: string;
    notes?: string;
    items: InvoiceItemDto[];
    discountType?: DiscountType;
    discountValue?: number;
    taxRate?: number;
    taxName?: string;
}
declare class UpdateInvoiceItemDto {
    description?: string;
    quantity?: number;
    unitPrice?: number;
    discount?: number;
    isPercentageDiscount?: boolean;
}
export declare class UpdateInvoiceDto {
    issueDate?: string;
    dueDate?: string;
    notes?: string;
    discountType?: DiscountType;
    discountValue?: number;
    taxRate?: number;
    taxName?: string;
    items?: UpdateInvoiceItemDto[];
}
export {};
