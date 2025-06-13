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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../common/constants");
const { BUSINESS_PROFILE_REQUIRED, BUSINESS_PROFILE_REQUIRED_FOR_VIEWING, CLIENT_UPDATE_FORBIDDEN, CLIENT_NOT_FOUND, CLIENT_DELETE_FORBIDDEN, } = constants_1.CONSTANT;
let ClientService = class ClientService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createClient(userId, createClientDto) {
        const businessProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (!businessProfile) {
            throw new common_1.ForbiddenException(BUSINESS_PROFILE_REQUIRED);
        }
        return this.prisma.client.create({
            data: {
                ...createClientDto,
                userId,
            },
        });
    }
    async getAllClients(userId) {
        const businessProfile = await this.prisma.businessProfile.findUnique({
            where: { userId },
        });
        if (!businessProfile) {
            throw new common_1.ForbiddenException(BUSINESS_PROFILE_REQUIRED_FOR_VIEWING);
        }
        return this.prisma.client.findMany({
            where: { userId },
        });
    }
    async updateClient(userId, clientId, updateClientDto) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });
        if (!client) {
            throw new common_1.NotFoundException(CLIENT_NOT_FOUND);
        }
        if (client.userId !== userId) {
            throw new common_1.ForbiddenException(CLIENT_UPDATE_FORBIDDEN);
        }
        return this.prisma.client.update({
            where: { id: clientId },
            data: updateClientDto,
        });
    }
    async deleteClient(userId, clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });
        if (!client) {
            throw new common_1.NotFoundException(CLIENT_NOT_FOUND);
        }
        if (client.userId !== userId) {
            throw new common_1.ForbiddenException(CLIENT_DELETE_FORBIDDEN);
        }
        await this.prisma.client.delete({
            where: { id: clientId },
        });
        return { message: 'Client successfully deleted' };
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientService);
//# sourceMappingURL=client.service.js.map