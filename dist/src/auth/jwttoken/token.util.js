"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenUtil = void 0;
const crypto = require("crypto");
class TokenUtil {
    static signAccessToken(jwtService, userId) {
        return jwtService.sign({ sub: userId }, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: '15m',
        });
    }
    static signRefreshToken(jwtService, userId) {
        return jwtService.sign({ sub: userId }, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
        });
    }
    static generateResetPasswordToken(len) {
        return crypto.randomBytes(len || 32).toString('hex');
    }
}
exports.TokenUtil = TokenUtil;
//# sourceMappingURL=token.util.js.map