"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessProfileModule = void 0;
const common_1 = require("@nestjs/common");
const business_profile_service_1 = require("./business-profile.service");
const business_profile_controller_1 = require("./business-profile.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let BusinessProfileModule = class BusinessProfileModule {
};
exports.BusinessProfileModule = BusinessProfileModule;
exports.BusinessProfileModule = BusinessProfileModule = __decorate([
    (0, common_1.Module)({
        controllers: [business_profile_controller_1.BusinessProfileController],
        providers: [business_profile_service_1.BusinessProfileService, prisma_service_1.PrismaService],
    })
], BusinessProfileModule);
//# sourceMappingURL=business-profile.module.js.map