export declare class AppUtilities {
    static hashPassword(password: string): Promise<string>;
    static decode(data: string, encoding?: BufferEncoding): string;
    static encode(data: string, encoding?: BufferEncoding): string;
    static validatePassword(incomingPassword: string, userPassword: string): Promise<boolean>;
    static generateToken(len?: number): string;
    static generateWalletAdd(len?: number): string;
    static hashToken(token: string, userId?: string): string;
    static readFile(filePath: string): string;
    static compareString(value1: string, value2: string): boolean;
    static capitalizeFirstLetter(value: string): string;
    static calculateInvoiceTotal(items: any, taxRate: any, discountType: any, discountValue: any): number;
}
