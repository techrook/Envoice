"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const auth_consumer_1 = require("./consumers/auth.consumer");
const queue_listener_1 = require("./queue.listener");
const client_1 = require("@prisma/client");
const email_service_1 = require("../common/email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const business_consumer_1 = require("./consumers/business.consumer");
const file_upload_service_1 = require("../common/file-upload/file-upload.service");
const users_service_1 = require("../users/users.service");
const business_profile_service_1 = require("../business-profile/business-profile.service");
const invoice_consumer_1 = require("./consumers/invoice.consumer");
const invoice_service_1 = require("../invoice/invoice.service");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        providers: [auth_consumer_1.SignUpConsumer, queue_listener_1.SignUpEventListener, client_1.PrismaClient, email_service_1.EmailService, prisma_service_1.PrismaService, business_consumer_1.BusinessProfileConsumer, file_upload_service_1.FileUploadService, users_service_1.UsersService, business_profile_service_1.BusinessProfileService, invoice_consumer_1.InvoiceConsumer, invoice_service_1.InvoiceService, queue_listener_1.BusinessEventListener],
        imports: [],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map