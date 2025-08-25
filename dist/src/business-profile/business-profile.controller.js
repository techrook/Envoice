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
exports.BusinessProfileController = void 0;
const common_1 = require("@nestjs/common");
const business_profile_service_1 = require("./business-profile.service");
const create_business_profile_dto_1 = require("./dto/create-business-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/JwtAuthGuard/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let BusinessProfileController = class BusinessProfileController {
    constructor(businessProfileService) {
        this.businessProfileService = businessProfileService;
    }
    async createBusinessProfile(req, createBusinessProfileDto, file) {
        const userId = req.user.id;
        return this.businessProfileService.createBusinessProfile(userId, createBusinessProfileDto, file);
    }
    async update(req, updateBusinessProfileDto, file) {
        console.log(file);
        const userId = req.user.id;
        return this.businessProfileService.updateBusinessProfile(userId, updateBusinessProfileDto, file);
    }
    async get(req) {
        const userId = req.user.id;
        return this.businessProfileService.getBusinessProfile(userId);
    }
    async deleteBusinessProfile(req) {
        const userId = req.user.id;
        return this.businessProfileService.deleteBusinessProfile(userId);
    }
};
exports.BusinessProfileController = BusinessProfileController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Business Profile' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_business_profile_dto_1.CreateBusinessProfileDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessProfileController.prototype, "createBusinessProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Business Profile' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('update'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_business_profile_dto_1.UpdateBusinessProfileDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessProfileController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Business Profile' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('get'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessProfileController.prototype, "get", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete Business Profile" }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessProfileController.prototype, "deleteBusinessProfile", null);
exports.BusinessProfileController = BusinessProfileController = __decorate([
    (0, swagger_1.ApiTags)('Business Profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('business-profile'),
    __metadata("design:paramtypes", [business_profile_service_1.BusinessProfileService])
], BusinessProfileController);
//# sourceMappingURL=business-profile.controller.js.map