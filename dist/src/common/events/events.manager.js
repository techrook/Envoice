"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../constants/index");
const events_definitions_1 = require("./events.definitions");
const { onUserRegister, onUserLogin, onEmailConfirmation, onPasswordReset, onPasswordChange, onBusinessProfileCreated, onBusinessProfileUpdated, onInvoiceCreated } = index_1.CONSTANT;
class EventsManager {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    onUserRegister(user) {
        return this.eventEmitter.emit(onUserRegister, new events_definitions_1.UserRegisterEvent(user));
    }
    onEmailConfirmationSend(user) {
        return this.eventEmitter.emit(onUserRegister, new events_definitions_1.UserRegisterEvent(user));
    }
    onUserLogin({ userId, accessToken, refreshToken, }) {
        return this.eventEmitter.emit(onUserLogin, new events_definitions_1.UserLoginEvent({
            userId,
            accessToken,
            refreshToken,
        }));
    }
    onEmailConfirmation(userId) {
        return this.eventEmitter.emit(onEmailConfirmation, new events_definitions_1.UserConfirmedMailEvent({ userId }));
    }
    onPasswordReset(user, priority) {
        return this.eventEmitter.emit(onPasswordReset, new events_definitions_1.PasswordResetEvent(user, priority));
    }
    onPasswordChange(user, priority) {
        try {
            this.eventEmitter.emit(onPasswordChange, new events_definitions_1.PassChangeSuccess(user, priority));
        }
        catch (error) {
            console.log(error);
        }
    }
    onBusinessProfileCreated(userId, file) {
        return this.eventEmitter.emit(onBusinessProfileCreated, new events_definitions_1.BusinessProfileCreatedEvent(userId, file));
    }
    onBusinessProfileUpdated(userId, file) {
        return this.eventEmitter.emit(onBusinessProfileUpdated, new events_definitions_1.BusinessProfileUpdatedEvent(userId, file));
    }
    onInvoiceCreated(userId, clientId, invoice) {
        return this.eventEmitter.emit(onInvoiceCreated, new events_definitions_1.InvoiceCreatedEvent(userId, clientId, invoice));
    }
}
exports.default = EventsManager;
//# sourceMappingURL=events.manager.js.map