"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsManagerModule = void 0;
const common_1 = require("@nestjs/common");
const eventemitter2_1 = require("eventemitter2");
const events_broker_1 = require("./events.broker");
const events_manager_1 = require("./events.manager");
const event_emitter_1 = require("@nestjs/event-emitter");
let EventsManagerModule = class EventsManagerModule {
};
exports.EventsManagerModule = EventsManagerModule;
exports.EventsManagerModule = EventsManagerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                verboseMemoryLeak: false,
            }),
        ],
        providers: [
            events_broker_1.EventBroker,
            {
                provide: events_manager_1.default,
                useFactory: (eventEmitter) => new events_manager_1.default(eventEmitter),
                inject: [eventemitter2_1.EventEmitter2],
            },
        ],
        exports: [events_manager_1.default, events_broker_1.EventBroker],
    })
], EventsManagerModule);
//# sourceMappingURL=events.module.js.map