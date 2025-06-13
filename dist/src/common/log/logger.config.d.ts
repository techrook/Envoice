import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
declare class AppLogger implements LoggerService {
    private readonly cfg;
    private logger;
    private options;
    constructor(cfg: ConfigService);
    private initLogger;
    log(message: any, ...optionalParams: any[]): Logger;
    error(message: any, ...optionalParams: any[]): Logger;
    warn(message: any, ...optionalParams: any[]): Logger;
    debug?(message: any, ...optionalParams: any[]): Logger;
    verbose?(message: any, ...optionalParams: any[]): Logger;
    threat?(message: any, ...optionalParams: any[]): Logger;
}
export default AppLogger;
