"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullConfigService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const queue_module_1 = require("../src/queue/queue.module");
const constants_1 = require("../src/common/constants");
const { AuthQ, BusinessQ, InvoiceQ, } = constants_1.CONSTANT;
let BullConfigService = class BullConfigService {
};
exports.BullConfigService = BullConfigService;
exports.BullConfigService = BullConfigService = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                useFactory: async (cfg) => ({
                    connection: {
                        host: cfg.get('Queue.host'),
                        password: cfg.get('Queue.pass'),
                        username: cfg.get('Queue.user'),
                        port: cfg.get('Queue.port'),
                        tls: {},
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: AuthQ }),
            bullmq_1.BullModule.registerQueue({ name: BusinessQ }),
            bullmq_1.BullModule.registerQueue({ name: InvoiceQ }),
            queue_module_1.QueueModule,
        ],
        exports: [bullmq_1.BullModule],
    })
], BullConfigService);
//# sourceMappingURL=bullConfigService.js.map