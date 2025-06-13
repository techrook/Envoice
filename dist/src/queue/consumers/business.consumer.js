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
exports.BusinessProfileConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const client_1 = require("@prisma/client");
const business_profile_service_1 = require("../../business-profile/business-profile.service");
const constants_1 = require("../../common/constants");
const email_service_1 = require("../../common/email/email.service");
const queue_interface_1 = require("../../common/interfaces/queue.interface");
const file_upload_service_1 = require("../../common/file-upload/file-upload.service");
const logger_config_1 = require("../../common/log/logger.config");
const users_service_1 = require("../../users/users.service");
const { onBusinessProfileCreated, BusinessQ, onBusinessProfileUpdated } = constants_1.CONSTANT;
let BusinessProfileConsumer = class BusinessProfileConsumer extends queue_interface_1.IBaseWoker {
    constructor(prisma, emailService, log, fileUploadService, usersService, businessProfileService) {
        super(log);
        this.prisma = prisma;
        this.emailService = emailService;
        this.log = log;
        this.fileUploadService = fileUploadService;
        this.usersService = usersService;
        this.businessProfileService = businessProfileService;
    }
    async process(job) {
        switch (job.name) {
            case onBusinessProfileCreated: {
                const { userId, file } = job.data;
                const user = await this.usersService.getBy({ field: 'id', value: userId });
                const fileToUpload = {
                    buffer: file.buffer,
                    originalname: file.originalname
                };
                let imageURLandName;
                try {
                    imageURLandName = await this.fileUploadService.uploadFile(fileToUpload);
                    await this.emailService.notifyUserBusinessProfileCreated(user);
                }
                catch (uploadError) {
                    this.log.error('File upload failed');
                }
                await this.businessProfileService.updateBusinessProfile(userId, { logo: imageURLandName.url });
                break;
            }
            case onBusinessProfileUpdated: {
                const { userId, file } = job.data;
                const fileToUpload = {
                    buffer: file.buffer,
                    originalname: file.originalname
                };
                let imageURLandName;
                try {
                    imageURLandName = await this.fileUploadService.uploadFile(fileToUpload);
                }
                catch (uploadError) {
                    this.log.error('File upload failed');
                }
                await this.businessProfileService.updateBusinessProfile(userId, { logo: imageURLandName.url });
                break;
            }
            default: {
                this.log.warn(`Unknown job name: ${job.name}`);
            }
        }
    }
};
exports.BusinessProfileConsumer = BusinessProfileConsumer;
exports.BusinessProfileConsumer = BusinessProfileConsumer = __decorate([
    (0, bullmq_1.Processor)(BusinessQ),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        email_service_1.EmailService,
        logger_config_1.default,
        file_upload_service_1.FileUploadService,
        users_service_1.UsersService,
        business_profile_service_1.BusinessProfileService])
], BusinessProfileConsumer);
//# sourceMappingURL=business.consumer.js.map