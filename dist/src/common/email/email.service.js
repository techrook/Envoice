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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const constants_1 = require("../constants");
const app_utilities_1 = require("../../app.utilities");
const config_1 = require("@nestjs/config");
const logger_config_1 = require("../log/logger.config");
const prisma_service_1 = require("../../prisma/prisma.service");
const token_util_1 = require("../../auth/jwttoken/token.util");
let EmailService = class EmailService {
    constructor(mailerService, cfg, logger, prisma) {
        this.mailerService = mailerService;
        this.cfg = cfg;
        this.logger = logger;
        this.prisma = prisma;
        this.basePath = this.cfg.get('appRoot');
    }
    prepMailContent(filePath) {
        return app_utilities_1.AppUtilities.readFile(`${process.cwd()}/templates/${filePath}`);
    }
    async dispatchMail(options) {
        return await this.mailerService.sendMail({
            to: options.email,
            from: `${constants_1.MAIL.noreply}`,
            subject: options.subject,
            html: options.content,
            attachments: options.attachments || [],
        });
    }
    async sendConfirmationEmail(user) {
        try {
            const token = await this.generateEmailConfirmationToken(user.id);
            const confirmUrl = `${this.cfg.get('app')}/auth/login?token=${token}`;
            const htmlTemplate = this.prepMailContent('confirmEmail.html');
            const htmlContent = htmlTemplate.replace('{{confirmUrl}}', confirmUrl);
            const opts = {
                email: user.email,
                username: user.username,
                subject: constants_1.MAIL.confirmEmail,
                content: htmlContent,
            };
            await this.dispatchMail(opts);
        }
        catch (err) {
            this.logger.error(err);
            throw new common_1.BadRequestException({ status: 403, error: constants_1.CONSTANT.OOPS });
        }
    }
    async generateEmailConfirmationToken(userId) {
        const accessToken = app_utilities_1.AppUtilities.generateToken(32);
        await this.prisma.user.update({
            where: { id: userId },
            data: { verifiedToken: accessToken },
        });
        return accessToken;
    }
    async sendPasswordReset(user) {
        try {
            const token = await token_util_1.TokenUtil.generateResetPasswordToken(16);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { verifiedToken: token },
            });
            const resetUrl = `${this.cfg.get('app')}/auth/change-password?token=${token}`;
            const htmlTemplate = this.prepMailContent('reqPasswordReset.html');
            const htmlContent = htmlTemplate
                .replace('{{resetUrl}}', resetUrl)
                .replace('{{username}}', user.username);
            const opts = {
                subject: constants_1.MAIL.passwordReset,
                content: htmlContent,
                ...user,
            };
            await this.dispatchMail(opts);
        }
        catch (err) {
            this.logger.error(err);
            throw new common_1.BadRequestException({ status: 403, error: constants_1.CONSTANT.OOPs });
        }
    }
    async notifyUserPasswordChange(user) {
        try {
            const htmlTemplate = this.prepMailContent('passChangeSuccess.html');
            const htmlContent = htmlTemplate.replace('{{username}}', app_utilities_1.AppUtilities.capitalizeFirstLetter(user.username));
            const opts = {
                email: user.email,
                username: user.username,
                subject: constants_1.MAIL.passswordChange,
                content: htmlContent,
            };
            await this.dispatchMail(opts);
        }
        catch (err) {
            this.logger.error(err);
            throw new common_1.BadRequestException({ status: 403, error: constants_1.CONSTANT.OOPs });
        }
    }
    async notifyUserBusinessProfileCreated(user) {
        try {
            const htmlTemplate = this.prepMailContent('businessProfileCreated.html');
            const htmlContent = htmlTemplate
                .replace('{{username}}', app_utilities_1.AppUtilities.capitalizeFirstLetter(user.username))
                .replace('{{dashboardLink}}', `${this.cfg.get('FRONTEND_URL')}/dashboard/business-profile`);
            const opts = {
                email: user.email,
                username: user.username,
                subject: 'Business Profile Created Successfully',
                content: htmlContent,
            };
            await this.dispatchMail(opts);
        }
        catch (error) {
            this.logger.error('Failed to send business profile creation notification', error);
            throw new common_1.BadRequestException({
                status: 403,
                error: error.message
            });
        }
    }
    async sendInvoiceToUser(user, client, invoice, pdfBuffer) {
        try {
            console.log("email", client);
            const htmlTemplate = this.prepMailContent('invoiceNotification.html');
            const htmlContent = htmlTemplate
                .replace('{{username}}', app_utilities_1.AppUtilities.capitalizeFirstLetter(client.name))
                .replace('{{invoiceNumber}}', invoice.invoiceNumber)
                .replace('{{totalAmount}}', invoice.totalAmount.toFixed(2))
                .replace('{{status}}', `${invoice.status}`);
            const attachments = [
                {
                    filename: `Invoice-${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                },
            ];
            await this.dispatchMail({
                email: user.email,
                username: user.username,
                subject: `Invoice #${invoice.invoiceNumber} from Envoice`,
                content: htmlContent,
                attachments,
            });
            await this.dispatchMail({
                email: client.email,
                username: client.name,
                subject: `Invoice #${invoice.invoiceNumber} from Envoice`,
                content: htmlContent,
                attachments,
            });
        }
        catch (error) {
            this.logger.error('Failed to send invoice email', error);
            throw new common_1.BadRequestException({
                status: 403,
                error: constants_1.CONSTANT.OOPs,
            });
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService,
        logger_config_1.default,
        prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map