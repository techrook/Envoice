"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_strategy_1 = require("../../auth/JWT Strategy/jwt.strategy");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mailer_1.MailerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    transport: {
                        host: config.get('MAIL_HOST'),
                        port: Number(config.get('MAIL_PORT')),
                        secure: true,
                        auth: {
                            user: config.get('MAIL_USERNAME'),
                            pass: config.get('MAIL_PASSWORD'),
                        },
                        debug: true,
                    },
                }),
            }),
        ],
        providers: [email_service_1.EmailService, prisma_service_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map