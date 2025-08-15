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
exports.BusinessProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../common/constants");
const events_manager_1 = require("../common/events/events.manager");
const { BUSINESS_PROFILE_EXISTS, BUSINESS_PROFILE_NOTFOUND, BUSINESS_PROFILE_CREATED, BUSINESS_PROFILE_UPDATED, BUSINESS_PROFILE_DELETED } = constants_1.CONSTANT;
let BusinessProfileService = class BusinessProfileService {
    constructor(prisma, eventsManager) {
        this.prisma = prisma;
        this.eventsManager = eventsManager;
    }
    async createBusinessProfile(userId, dto, file) {
        const existingProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            throw new common_1.NotFoundException(BUSINESS_PROFILE_EXISTS);
        }
        const businessProfile = await this.prisma.businessProfile.create({
            data: {
                userId,
                logo: null,
                ...dto,
            },
        });
        if (file) {
            this.eventsManager.onBusinessProfileCreated(userId, file);
        }
        return BUSINESS_PROFILE_CREATED;
    }
    async updateBusinessProfile(userId, dto, file) {
        const existingProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (!existingProfile) {
            throw new common_1.NotFoundException(BUSINESS_PROFILE_NOTFOUND);
        }
        if (file) {
            this.eventsManager.onBusinessProfileUpdated(userId, file);
        }
        const updatedProfile = await this.prisma.businessProfile.update({
            where: { userId },
            data: dto,
        });
        return BUSINESS_PROFILE_UPDATED;
    }
    async getBusinessProfile(userId) {
        const businessProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (!businessProfile) {
            throw new common_1.NotFoundException(BUSINESS_PROFILE_NOTFOUND);
        }
        return businessProfile;
    }
    async deleteBusinessProfile(userId) {
        await this.prisma.businessProfile.delete({
            where: { userId }
        });
        return BUSINESS_PROFILE_DELETED;
    }
};
exports.BusinessProfileService = BusinessProfileService;
exports.BusinessProfileService = BusinessProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_manager_1.default])
], BusinessProfileService);
//# sourceMappingURL=business-profile.service.js.map