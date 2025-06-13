import { Queue } from 'bullmq';
export declare class EventBroker {
    private readonly authQ;
    private readonly businessQ;
    private readonly invoiceQ;
    private queues;
    constructor(authQ: Queue, businessQ: Queue, invoiceQ: Queue);
    handleUserRegister(event: any): Promise<void>;
    handleSendEmailConfirmation(event: any): Promise<void>;
    handleUserLogin(event: any): Promise<void>;
    handleEmailConfirmation(event: any): Promise<void>;
    handlePasswordReset(event: any): Promise<void>;
    handleBusinessProfileCreated(event: any): Promise<void>;
    handleBusinessProfileUpdated(event: any): Promise<void>;
    handlePasswordChangeSuccess(event: any): Promise<void>;
    handleInvoiceCreated(event: any): Promise<void>;
}
