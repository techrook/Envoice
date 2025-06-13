"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceCreatedEvent = exports.BusinessProfileUpdatedEvent = exports.BusinessProfileCreatedEvent = exports.PasswordResetEvent = exports.PassChangeSuccess = exports.UserLoginEvent = exports.UserConfirmedMailEvent = exports.UserRegisterEvent = void 0;
class UserRegisterEvent {
    constructor(payload) {
        this.payload = payload;
    }
}
exports.UserRegisterEvent = UserRegisterEvent;
class UserConfirmedMailEvent {
    constructor(payload) {
        this.payload = payload;
    }
}
exports.UserConfirmedMailEvent = UserConfirmedMailEvent;
class UserLoginEvent {
    constructor(payload) {
        this.payload = payload;
    }
}
exports.UserLoginEvent = UserLoginEvent;
class PassChangeSuccess {
    constructor(payload, priority) {
        this.payload = payload;
        this.priority = priority;
    }
}
exports.PassChangeSuccess = PassChangeSuccess;
class PasswordResetEvent {
    constructor(user, priority) {
        this.user = user;
        this.priority = priority;
    }
}
exports.PasswordResetEvent = PasswordResetEvent;
class BusinessProfileCreatedEvent {
    constructor(userId, file) {
        this.userId = userId;
        this.file = file;
    }
}
exports.BusinessProfileCreatedEvent = BusinessProfileCreatedEvent;
class BusinessProfileUpdatedEvent {
    constructor(userId, file) {
        this.userId = userId;
        this.file = file;
    }
}
exports.BusinessProfileUpdatedEvent = BusinessProfileUpdatedEvent;
class InvoiceCreatedEvent {
    constructor(userId, clientId, invoice) {
        this.userId = userId;
        this.clientId = clientId;
        this.invoice = invoice;
    }
}
exports.InvoiceCreatedEvent = InvoiceCreatedEvent;
//# sourceMappingURL=events.definitions.js.map