import { IListenToEvents } from 'src/common/interfaces/queue.interface';
import AppLogger from 'src/common/log/logger.config';
export declare class SignUpEventListener extends IListenToEvents {
    constructor(log: AppLogger);
}
export declare class BusinessEventListener extends IListenToEvents {
    constructor(log: AppLogger);
}
export declare class InvoiceEventListener extends IListenToEvents {
    constructor(log: AppLogger);
}
