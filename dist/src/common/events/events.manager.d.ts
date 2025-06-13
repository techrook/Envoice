import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { Priority } from './events.interface';
declare class EventsManager {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    onUserRegister(user: any): boolean;
    onEmailConfirmationSend(user: any): boolean;
    onUserLogin({ userId, accessToken, refreshToken, }: {
        userId: any;
        accessToken: any;
        refreshToken: any;
    }): boolean;
    onEmailConfirmation(userId: string): boolean;
    onPasswordReset(user: User, priority: Priority): boolean;
    onPasswordChange(user: User, priority: Priority): void;
    onBusinessProfileCreated(userId: string, file: Express.Multer.File): boolean;
    onBusinessProfileUpdated(userId: string, file: Express.Multer.File): boolean;
    onInvoiceCreated(userId: string, clientId: string, invoice: object): boolean;
}
export default EventsManager;
