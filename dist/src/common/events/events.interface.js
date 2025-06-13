"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuePriority = void 0;
class QueuePriority {
    static baseLevel(options) {
        return {
            ...options,
        };
    }
    static level1() {
        return this.baseLevel({
            attempts: 10,
            LIFO: true,
            FIFO: false,
            removeOnComplete: true,
            removeOnFail: false,
            backoff: {
                type: 'fixed',
                delay: 1000,
            },
        });
    }
    static level2() {
        return this.baseLevel({
            attempts: 9,
            LIFO: true,
            FIFO: false,
            removeOnComplete: true,
            removeOnFail: false,
            backoff: {
                type: 'fixed',
                delay: 2000,
            },
        });
    }
    static level3() {
        return this.baseLevel({
            attempts: 8,
            LIFO: true,
            FIFO: false,
            removeOnComplete: true,
            removeOnFail: false,
            backoff: {
                type: 'fixed',
                delay: 3000,
            },
        });
    }
    static level4() {
        return this.baseLevel({
            attempts: 7,
            LIFO: true,
            FIFO: false,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 4000,
            },
        });
    }
    static level5() {
        return this.baseLevel({
            attempts: 6,
            LIFO: false,
            FIFO: true,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 5000,
            },
        });
    }
    static level6(dto) {
        return this.baseLevel({
            attempts: dto.attempts ? dto.attempts : 5,
            LIFO: false,
            FIFO: true,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 6000,
            },
        });
    }
    static level7() {
        return this.baseLevel({
            attempts: 4,
            LIFO: false,
            FIFO: true,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 7000,
            },
        });
    }
    static level8() {
        return this.baseLevel({
            attempts: 3,
            LIFO: false,
            FIFO: true,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 8000,
            },
        });
    }
    static level9() {
        return this.baseLevel({
            attempts: 2,
            LIFO: false,
            FIFO: true,
            removeOnComplete: false,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 9000,
            },
        });
    }
    static level10() {
        return this.baseLevel({
            attempts: 1,
            LIFO: false,
            FIFO: true,
            removeOnComplete: false,
            removeOnFail: true,
            backoff: {
                type: 'not fixed',
                delay: 10000,
            },
        });
    }
}
exports.QueuePriority = QueuePriority;
//# sourceMappingURL=events.interface.js.map