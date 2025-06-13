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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../common/database/crud.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService extends crud_service_1.CrudService {
    constructor(prisma) {
        super(prisma.user);
        this.prisma = prisma;
    }
    async getBy(dto) {
        return await this.prisma.user.findFirst({
            where: {
                [dto.field]: dto.value,
            },
        });
    }
    async createUser(dto) {
        return await this.prisma.user.create({
            data: {
                ...dto,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
    }
    async registerUser(dto, password) {
        const data = {
            ...dto,
            password,
        };
        try {
            return await this.createUser(data);
        }
        catch (error) {
            console.log('Error Creating User', error);
            return error;
        }
    }
    async findUserByEmail(identity) {
        return await this.getBy({
            field: 'email',
            value: identity,
        });
    }
    async findUserByUsername(identity) {
        return await this.getBy({
            field: 'username',
            value: identity,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map