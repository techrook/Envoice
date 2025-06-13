"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = require("../config/configuration");
const logger_module_1 = require("./common/log/logger.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./common/events/events.module");
const queue_module_1 = require("./queue/queue.module");
const email_module_1 = require("./common/email/email.module");
const email_service_1 = require("./common/email/email.service");
const bullConfigService_1 = require("../config/bullConfigService");
const business_profile_module_1 = require("./business-profile/business-profile.module");
const client_module_1 = require("./client/client.module");
const invoice_module_1 = require("./invoice/invoice.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const file_upload_module_1 = require("./common/file-upload/file-upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration],
                validate: configuration_1.validate,
            }),
            logger_module_1.LoggerModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            bullConfigService_1.BullConfigService,
            users_module_1.UsersModule,
            events_module_1.EventsManagerModule,
            queue_module_1.QueueModule,
            email_module_1.EmailModule,
            business_profile_module_1.BusinessProfileModule,
            client_module_1.ClientModule,
            invoice_module_1.InvoiceModule,
            cloudinary_module_1.CloudinaryModule,
            file_upload_module_1.FileUploadModule,
        ],
        controllers: [],
        providers: [email_service_1.EmailService, events_module_1.EventsManagerModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map