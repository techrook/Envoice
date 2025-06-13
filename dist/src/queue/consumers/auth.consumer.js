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
exports.SignUpConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const client_1 = require("@prisma/client");
const logger_config_1 = require("../../common/log/logger.config");
const queue_interface_1 = require("../../common/interfaces/queue.interface");
const constants_1 = require("../../common/constants");
const email_service_1 = require("../../common/email/email.service");
const { sendConfirmationMail, AuthQ, onUserLogin, onPasswordChange, onPasswordReset, } = constants_1.CONSTANT;
let SignUpConsumer = class SignUpConsumer extends queue_interface_1.IBaseWoker {
    constructor(prisma, emailService, log) {
        super(log);
        this.prisma = prisma;
        this.emailService = emailService;
        this.log = log;
    }
    async process(job) {
        switch (job.name) {
            case sendConfirmationMail: {
                const { user } = job.data;
                await this.emailService.sendConfirmationEmail(user);
                break;
            }
            case onUserLogin: {
                const { userId, accessToken, refreshToken } = job.data;
                await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        lastLogin: new Date().toISOString(),
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    },
                });
                break;
            }
            case 'emailConfirmed': {
                const { userId } = job.data;
                await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        emailVerified: true,
                        verifiedToken: null,
                    },
                });
                break;
            }
            case onPasswordReset: {
                const { user } = job.data;
                (await user) ? this.emailService.sendPasswordReset(user) : null;
                break;
            }
            case onPasswordChange: {
                console.log('Password Change Event', job.data);
                const { payload } = job.data;
                (await payload)
                    ? this.emailService.notifyUserPasswordChange(payload)
                    : null;
                break;
            }
            default: {
                this.log.warn(`Unknown job name: ${job.name}`);
            }
        }
    }
};
exports.SignUpConsumer = SignUpConsumer;
exports.SignUpConsumer = SignUpConsumer = __decorate([
    (0, bullmq_1.Processor)(AuthQ),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        email_service_1.EmailService,
        logger_config_1.default])
], SignUpConsumer);
//# sourceMappingURL=auth.consumer.js.map