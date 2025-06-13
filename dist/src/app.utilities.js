"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUtilities = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const crypto = require("crypto");
const fs = require("fs");
let AppUtilities = class AppUtilities {
    static async hashPassword(password) {
        try {
            const hashedPassword = await argon.hash(password);
            return hashedPassword;
        }
        catch (error) {
            throw new Error('Oops! Something went wrong!');
        }
    }
    static decode(data, encoding = 'base64') {
        return Buffer.from(data, encoding).toString();
    }
    static encode(data, encoding = 'base64') {
        return Buffer.from(data).toString(encoding);
    }
    static async validatePassword(incomingPassword, userPassword) {
        return argon.verify(userPassword, incomingPassword);
    }
    static generateToken(len) {
        return crypto.randomBytes(len || 32).toString('hex');
    }
    static generateWalletAdd(len) {
        return this.generateToken(len).toUpperCase();
    }
    static hashToken(token, userId) {
        return crypto
            .createHash('sha256')
            .update(token + (userId || ''))
            .digest('hex');
    }
    static readFile(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }
    static compareString(value1, value2) {
        if (value1 === value2)
            return true;
        return false;
    }
    static capitalizeFirstLetter(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    static calculateInvoiceTotal(items, taxRate, discountType, discountValue) {
        let subtotal = 0;
        for (const item of items) {
            const itemTotal = item.unitPrice * item.quantity;
            const discount = item.isPercentageDiscount
                ? itemTotal * (item.discount / 100)
                : item.discount;
            item.amount = itemTotal - discount;
            subtotal += item.amount;
        }
        let discountedTotal = subtotal;
        if (discountType === 'PERCENTAGE') {
            discountedTotal -= subtotal * (discountValue / 100);
        }
        else if (discountType === 'FIXED') {
            discountedTotal -= discountValue;
        }
        const tax = discountedTotal * (taxRate / 100);
        const totalAmount = discountedTotal + tax;
        return totalAmount;
    }
};
exports.AppUtilities = AppUtilities;
exports.AppUtilities = AppUtilities = __decorate([
    (0, common_1.Injectable)()
], AppUtilities);
//# sourceMappingURL=app.utilities.js.map