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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBroker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const event_emitter_1 = require("@nestjs/event-emitter");
const bullmq_2 = require("bullmq");
const constants_1 = require("../constants");
const { onPasswordChange, onUserRegister, onPasswordReset, sendConfirmationMail, onEmailConfirmationSend, AuthQ, BusinessQ, InvoiceQ, onUserLogin, onEmailConfirmation, onBusinessProfileCreated, onBusinessProfileUpdated, onInvoiceCreated, } = constants_1.CONSTANT;
let EventBroker = class EventBroker {
    constructor(authQ, businessQ, invoiceQ) {
        this.authQ = authQ;
        this.businessQ = businessQ;
        this.invoiceQ = invoiceQ;
        this.queues = {};
        this.queues[AuthQ] = authQ;
        this.queues[BusinessQ] = businessQ;
        this.queues[InvoiceQ] = invoiceQ;
    }
    async handleUserRegister(event) {
        const user = event.payload;
        await this.authQ.add(sendConfirmationMail, {
            user,
        });
    }
    async handleSendEmailConfirmation(event) {
        const user = event.payload;
        await this.authQ.add('sendConfirmationMail', {
            user,
        });
    }
    async handleUserLogin(event) {
        const { userId, accessToken, refreshToken } = event.payload;
        await this.authQ.add(onUserLogin, {
            userId,
            accessToken,
            refreshToken,
        });
    }
    async handleEmailConfirmation(event) {
        const { userId, token } = event.payload;
        await this.authQ.add('emailConfirmed', {
            userId,
            token,
        });
    }
    async handlePasswordReset(event) {
        const { user, priority } = event;
        await this.authQ.add(onPasswordReset, {
            user,
            priority,
        });
    }
    async handleBusinessProfileCreated(event) {
        const { userId, file } = event;
        await this.businessQ.add(onBusinessProfileCreated, {
            userId,
            file,
        });
    }
    async handleBusinessProfileUpdated(event) {
        const { userId, file } = event;
        await this.businessQ.add(onBusinessProfileUpdated, {
            userId,
            file,
        });
    }
    async handlePasswordChangeSuccess(event) {
        const { payload, priority } = event;
        await this.authQ.add(onPasswordChange, {
            payload,
        }, {
            ...priority,
        });
    }
    async handleInvoiceCreated(event) {
        const { userId, clientId, invoice } = event;
        await this.invoiceQ.add(onInvoiceCreated, {
            userId,
            clientId,
            invoice,
        });
    }
};
exports.EventBroker = EventBroker;
__decorate([
    (0, event_emitter_1.OnEvent)(onUserRegister),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleUserRegister", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onEmailConfirmationSend),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleSendEmailConfirmation", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onUserLogin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleUserLogin", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onEmailConfirmation),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleEmailConfirmation", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onPasswordReset),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handlePasswordReset", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onBusinessProfileCreated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleBusinessProfileCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onBusinessProfileUpdated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleBusinessProfileUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onPasswordChange),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handlePasswordChangeSuccess", null);
__decorate([
    (0, event_emitter_1.OnEvent)(onInvoiceCreated),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventBroker.prototype, "handleInvoiceCreated", null);
exports.EventBroker = EventBroker = __decorate([
    __param(0, (0, bullmq_1.InjectQueue)(AuthQ)),
    __param(1, (0, bullmq_1.InjectQueue)(BusinessQ)),
    __param(2, (0, bullmq_1.InjectQueue)(InvoiceQ)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], EventBroker);
//# sourceMappingURL=events.broker.js.map