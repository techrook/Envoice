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
exports.InvoiceEventListener = exports.BusinessEventListener = exports.SignUpEventListener = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const queue_interface_1 = require("../common/interfaces/queue.interface");
const logger_config_1 = require("../common/log/logger.config");
let SignUpEventListener = class SignUpEventListener extends queue_interface_1.IListenToEvents {
    constructor(log) {
        super(log);
    }
};
exports.SignUpEventListener = SignUpEventListener;
exports.SignUpEventListener = SignUpEventListener = __decorate([
    (0, bullmq_1.QueueEventsListener)('SignUpJobs'),
    __metadata("design:paramtypes", [logger_config_1.default])
], SignUpEventListener);
let BusinessEventListener = class BusinessEventListener extends queue_interface_1.IListenToEvents {
    constructor(log) {
        super(log);
    }
};
exports.BusinessEventListener = BusinessEventListener;
exports.BusinessEventListener = BusinessEventListener = __decorate([
    (0, bullmq_1.QueueEventsListener)('BusinessJobs'),
    __metadata("design:paramtypes", [logger_config_1.default])
], BusinessEventListener);
let InvoiceEventListener = class InvoiceEventListener extends queue_interface_1.IListenToEvents {
    constructor(log) {
        super(log);
    }
};
exports.InvoiceEventListener = InvoiceEventListener;
exports.InvoiceEventListener = InvoiceEventListener = __decorate([
    (0, bullmq_1.QueueEventsListener)('InvoiceJobs'),
    __metadata("design:paramtypes", [logger_config_1.default])
], InvoiceEventListener);
//# sourceMappingURL=queue.listener.js.map