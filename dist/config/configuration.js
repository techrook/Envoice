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
exports.configuration = void 0;
exports.validate = validate;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EnvironmentVariables {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "APP_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "VERSION", void 0);
function validate(config) {
    const validatedConfig = (0, class_transformer_1.plainToClass)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        const messages = [];
        errors.forEach((error) => {
            if (error instanceof class_validator_1.ValidationError) {
                const message = `Abort startup w/ invalid configuration: ${error.property} equals ${error.value} is invalid`;
                messages.push(message);
            }
        });
        throw new Error(messages[0]);
    }
    return validatedConfig;
}
const configuration = () => ({
    port: parseInt(process.env.PORT, 10) || 3456,
    appName: process.env.APP_NAME || 'Envoice',
    appRoot: process.cwd(),
    version: process.env.VERSION || '1.0',
    host: process.env.APP_HOST || `http://localhost:${process.env.PORT || 3456}`,
    FRONTEND_URL: process.env.FRONTEND_URL,
    Queue: {
        url: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        user: process.env.REDIS_USERNAME,
        pass: process.env.REDIS_PASS,
        db: process.env.REDIS_DB || 'shadow-troupe',
    },
    Twitter: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL,
    }
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map