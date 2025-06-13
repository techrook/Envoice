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
exports.UpdatePasswordDto = exports.ChangePasswordDto = exports.PasswordFieldsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PasswordFieldsDto {
}
exports.PasswordFieldsDto = PasswordFieldsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'newSecurePassword123',
        description: 'New password for the account',
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password is too short. Minimal length is $constraint1 characters',
    }),
    __metadata("design:type", String)
], PasswordFieldsDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'newSecurePassword123',
        description: 'Confirmation of the new password',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PasswordFieldsDto.prototype, "confirmNewPassword", void 0);
class ChangePasswordDto extends PasswordFieldsDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'currentPassword123',
        description: 'Current password of the user',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
class UpdatePasswordDto extends PasswordFieldsDto {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
//# sourceMappingURL=password.dto.js.map