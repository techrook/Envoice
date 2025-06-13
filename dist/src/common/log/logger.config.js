"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston_1 = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, label, printf } = winston_1.format;
const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level}] [${label}]: ${message}`;
});
let AppLogger = class AppLogger {
    constructor(cfg) {
        this.cfg = cfg;
        this.options = {
            file: {
                level: cfg.get('logLevel'),
                filename: `${cfg.get('appRoot')}/logs/${cfg.get('NODE_ENV')}-%DATE%-app.log`,
                json: true,
                maxsize: 5242880,
                colorize: true,
                datePattern: 'YYYY-MM-DD',
                handleExceptions: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: combine(winston_1.format.splat(), winston_1.format.json(), label({ label: cfg.get('appName') }), timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }), logFormat),
            },
            console: {
                level: cfg.get('logLevel'),
                handleExceptions: true,
                exitOnError: false,
                json: false,
                colorize: true,
                format: combine(winston_1.format.colorize(), winston_1.format.splat(), label({ label: cfg.get('appName') }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
            },
        };
        this.logger = this.initLogger();
    }
    initLogger() {
        return (0, winston_1.createLogger)({
            transports: [
                new winston_1.transports.Console(this.options.console),
                new DailyRotateFile(this.options.file),
            ],
        });
    }
    log(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.info(msg, { ...meta });
        }
        return this.logger.info(message, optionalParams);
    }
    error(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.error(msg, { ...meta });
        }
        return this.logger.error(message, optionalParams);
    }
    warn(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.warn(msg, { ...meta });
        }
        return this.logger.warn(message, optionalParams);
    }
    debug(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.debug(msg, { ...meta });
        }
        return this.logger.debug(message, optionalParams);
    }
    verbose(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.verbose(msg, { ...meta });
        }
        return this.logger.verbose(message, optionalParams);
    }
    threat(message, ...optionalParams) {
        if (typeof message === 'object') {
            const { message: msg, ...meta } = message;
            return this.logger.warn(msg, { ...meta });
        }
        return this.logger.warn(message, optionalParams);
    }
};
AppLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppLogger);
exports.default = AppLogger;
//# sourceMappingURL=logger.config.js.map