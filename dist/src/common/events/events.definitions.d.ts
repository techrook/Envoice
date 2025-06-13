import { User } from '@prisma/client';
import { Priority } from './events.interface';
export declare class UserRegisterEvent {
    payload: {
        id: string;
        email: string;
        username: string;
    };
    constructor(payload: {
        id: string;
        email: string;
        username: string;
    });
}
export declare class UserConfirmedMailEvent {
    payload: {
        userId: string;
    };
    constructor(payload: {
        userId: string;
    });
}
export declare class UserLoginEvent {
    payload: {
        userId: any;
        accessToken?: string;
        refreshToken?: string;
    };
    constructor(payload: {
        userId: any;
        accessToken?: string;
        refreshToken?: string;
    });
}
export declare class PassChangeSuccess {
    payload: any;
    priority?: Priority;
    constructor(payload: any, priority?: Priority);
}
export declare class PasswordResetEvent {
    user: User;
    priority: Priority;
    constructor(user: User, priority: Priority);
}
export declare class BusinessProfileCreatedEvent {
    userId: string;
    file: Express.Multer.File;
    constructor(userId: string, file: Express.Multer.File);
}
export declare class BusinessProfileUpdatedEvent {
    userId: string;
    file: Express.Multer.File;
    constructor(userId: string, file: Express.Multer.File);
}
export declare class InvoiceCreatedEvent {
    userId: string;
    clientId: string;
    invoice: object;
    constructor(userId: string, clientId: string, invoice: object);
}
