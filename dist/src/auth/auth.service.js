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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const constants_1 = require("../common/constants");
const app_utilities_1 = require("../app.utilities");
const events_manager_1 = require("../common/events/events.manager");
const library_1 = require("@prisma/client/runtime/library");
const token_util_1 = require("./jwttoken/token.util");
const client_1 = require("@prisma/client");
const events_interface_1 = require("../common/events/events.interface");
const { CREDS_TAKEN, USERNAME_TAKEN, CONFIRM_MAIL_SENT, RESET_MAIL, USER_NOT_FOUND, INCORRECT_CREDS, MAIL_UNVERIFIED, INVALID_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRED, REFRESH_TOKEN_NOTFOUND, REFRESH_TOKEN_NOTFORUSER, UNAUTHORIZED, PASSWORD_NOT_MATCH, PASSWORD_CHANGED, } = constants_1.CONSTANT;
let AuthService = class AuthService {
    constructor(prisma, usersService, eventsManager, jwtService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.eventsManager = eventsManager;
        this.jwtService = jwtService;
    }
    async signUp(dto) {
        try {
            let isExistingUser = await this.usersService.findUserByEmail(dto.email);
            if (isExistingUser)
                throw new common_1.ConflictException(CREDS_TAKEN);
            isExistingUser = await this.usersService.findUserByUsername(dto.username);
            if (isExistingUser)
                throw new common_1.ConflictException(USERNAME_TAKEN);
            const password = await app_utilities_1.AppUtilities.hashPassword(dto.password);
            const user = await this.usersService.registerUser(dto, password);
            this.eventsManager.onUserRegister(user);
            return {
                message: CONFIRM_MAIL_SENT(dto.email),
            };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.ForbiddenException(CREDS_TAKEN);
            }
            throw error;
        }
    }
    async login(dto) {
        try {
            const user = await this.usersService.findUserByEmail(dto.email);
            if (!user)
                throw new common_1.UnauthorizedException(INCORRECT_CREDS);
            const isMatch = await app_utilities_1.AppUtilities.validatePassword(dto.password, user.password);
            if (!isMatch)
                throw new common_1.UnauthorizedException(INCORRECT_CREDS);
            if (!user.emailVerified) {
                throw new common_1.UnauthorizedException(MAIL_UNVERIFIED);
            }
            const accessToken = token_util_1.TokenUtil.signAccessToken(this.jwtService, user.id);
            const refreshToken = token_util_1.TokenUtil.signRefreshToken(this.jwtService, user.id);
            await this.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
            const userId = user.id;
            this.eventsManager.onUserLogin({
                userId,
                accessToken,
                refreshToken,
            });
            return { accessToken, refreshToken };
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.ForbiddenException(INCORRECT_CREDS);
            }
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            });
        }
        catch (err) {
            throw new common_1.UnauthorizedException(INVALID_REFRESH_TOKEN);
        }
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException(REFRESH_TOKEN_NOTFOUND);
        }
        if (storedToken.userId !== payload.sub) {
            throw new common_1.UnauthorizedException(REFRESH_TOKEN_NOTFORUSER);
        }
        if (new Date() > storedToken.expiresAt) {
            throw new common_1.UnauthorizedException(REFRESH_TOKEN_EXPIRED);
        }
        const accessToken = token_util_1.TokenUtil.signAccessToken(this.jwtService, payload.sub);
        const newRefreshToken = token_util_1.TokenUtil.signRefreshToken(this.jwtService, payload.sub);
        await this.prisma.refreshToken.update({
            where: { token: refreshToken },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    async confirmEmail(token) {
        const userId = await this.verifyToken(token);
        const accessToken = token_util_1.TokenUtil.signAccessToken(this.jwtService, userId);
        const refreshToken = token_util_1.TokenUtil.signRefreshToken(this.jwtService, userId);
        this.eventsManager.onEmailConfirmation(userId);
        return { accessToken, refreshToken };
    }
    async verifyToken(token) {
        const user = await this.prisma.user.findFirst({
            where: { verifiedToken: token },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return user.id;
    }
    async requestPasswordReset(dto) {
        const user = await this.usersService.findUserByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException(USER_NOT_FOUND);
        }
        this.eventsManager.onPasswordReset(user, events_interface_1.QueuePriority.level1());
        return RESET_MAIL(dto.email);
    }
    async resetPassword(dto) {
        const isUser = await this.verifyToken(dto.token);
        console.log("Verified User:", isUser);
        if (!isUser)
            throw new common_1.UnauthorizedException(UNAUTHORIZED);
        return await this.updatePassword({
            confirmNewPassword: dto.confirmNewPassword,
            newPassword: dto.newPassword,
        }, isUser);
    }
    async updatePassword(dto, id) {
        console.log("Updating password for User ID:", id);
        const isMatch = app_utilities_1.AppUtilities.compareString(dto.newPassword, dto.confirmNewPassword);
        console.log(dto.newPassword, dto.confirmNewPassword);
        if (!isMatch)
            throw new common_1.NotAcceptableException(PASSWORD_NOT_MATCH);
        if (id) {
            const password = await app_utilities_1.AppUtilities.hashPassword(dto.confirmNewPassword);
            console.log("Hashed Password:", password);
            const updatedUser = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    password: password,
                },
            });
            console.log(updatedUser);
            console.log("Updated User:", updatedUser);
            if (!updatedUser) {
                throw new common_1.InternalServerErrorException("Password update failed");
            }
            this.eventsManager.onPasswordChange(updatedUser, events_interface_1.QueuePriority.level1());
            return { message: PASSWORD_CHANGED };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        users_service_1.UsersService,
        events_manager_1.default,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map