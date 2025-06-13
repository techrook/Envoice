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
exports.InvoiceConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const logger_config_1 = require("../../common/log/logger.config");
const constants_1 = require("../../common/constants");
const queue_interface_1 = require("../../common/interfaces/queue.interface");
const email_service_1 = require("../../common/email/email.service");
const client_1 = require("@prisma/client");
const { onInvoiceCreated, InvoiceQ } = constants_1.CONSTANT;
const invoice_service_1 = require("../../invoice/invoice.service");
let InvoiceConsumer = class InvoiceConsumer extends queue_interface_1.IBaseWoker {
    constructor(log, prisma, emailService, invoiceService) {
        super(log);
        this.log = log;
        this.prisma = prisma;
        this.emailService = emailService;
        this.invoiceService = invoiceService;
    }
    async process(job) {
        switch (job.name) {
            case onInvoiceCreated: {
                const { userId, clientId, invoice } = job.data;
                this.log.log(`Processing invoice creation for user ${userId} and client ${clientId}`);
                const [user, client] = await Promise.all([
                    this.prisma.user.findUnique({ where: { id: userId } }),
                    this.prisma.client.findUnique({ where: { id: clientId } }),
                ]);
                if (!user || !client) {
                    this.log.error(`User or client not found`);
                    return;
                }
                const pdfBuffer = await this.invoiceService.generate(invoice, user, client);
                await this.emailService.sendInvoiceToUser(user, client, invoice, pdfBuffer);
                break;
            }
            default:
                this.log.warn(`Unknown job name: ${job.name}`);
                break;
        }
    }
};
exports.InvoiceConsumer = InvoiceConsumer;
exports.InvoiceConsumer = InvoiceConsumer = __decorate([
    (0, bullmq_1.Processor)(InvoiceQ),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_config_1.default,
        client_1.PrismaClient,
        email_service_1.EmailService,
        invoice_service_1.InvoiceService])
], InvoiceConsumer);
//# sourceMappingURL=invoice.consumer.js.map