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
exports.IListenToEvents = exports.IBaseWoker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const bullmq_3 = require("bullmq");
class IBaseWoker extends bullmq_2.WorkerHost {
    constructor(log) {
        super();
        this.log = log;
    }
    onActive(job) {
        this.log.log(`Processing job ${job.id} of type ${job.name}`);
    }
    onCompleted(job, result) {
        this.log.log(`Completed job ${job.id} of type ${job.name}.`);
    }
    onFailed(job, error) {
        this.log.error(`Failed job ${job.id} of type ${job.name} with error ${error.message}.`);
    }
    onStalled(job) {
        this.log.warn(`Stalled job ${job.id} of type ${job.name}.`);
    }
    onProgress(job, progress) {
        this.log.log(`Job ${job.id} of type ${job.name} is ${progress}% complete.`);
    }
    onPaused() {
        this.log.log(`The worker has been paused.`);
    }
    onResumed() {
        this.log.log(`The worker has resumed.`);
    }
    onDrained() {
        this.log.log(`All jobs in the queue have been processed.`);
    }
}
exports.IBaseWoker = IBaseWoker;
__decorate([
    (0, bullmq_2.OnWorkerEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_3.Job]),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onActive", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_3.Job, Object]),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_3.Job, Error]),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onFailed", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('stalled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_3.Job]),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onStalled", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('progress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_3.Job, Object]),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onProgress", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('paused'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onPaused", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('resumed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onResumed", null);
__decorate([
    (0, bullmq_2.OnWorkerEvent)('drained'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IBaseWoker.prototype, "onDrained", null);
class IListenToEvents extends bullmq_1.QueueEventsHost {
    constructor(log) {
        super();
        this.log = log;
    }
    onActive(job) {
        this.log.log(`Processing job ${job.jobId}...`);
    }
    onFailed(job, failedReason) {
        this.log.error(`Failed: Job ${job.jobId} has failed with reason ${failedReason}.`);
    }
    onDelayed(job) {
        this.log.log(`Delayed: Job ${job.jobId}...`);
    }
    onAdded(job) {
        this.log.log(`Added: Job ${job.jobId}...`);
    }
    onResumed(job) {
        this.log.log(`Resumed: Job ${job.jobId}...`);
    }
    onWaiting(job) {
        this.log.log(`Waiting: Job ${job.jobId}...`);
    }
    onCompleted(job, result) {
        this.log.log(`Job ${job.jobId} completed with result: ${JSON.stringify(result)}.`);
    }
}
exports.IListenToEvents = IListenToEvents;
__decorate([
    (0, bullmq_1.OnQueueEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onActive", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onFailed", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('delayed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onDelayed", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onAdded", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('resumed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onResumed", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('waiting'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onWaiting", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IListenToEvents.prototype, "onCompleted", null);
//# sourceMappingURL=queue.interface.js.map