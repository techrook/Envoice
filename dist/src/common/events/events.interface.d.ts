export interface Priority {
    attempts?: number;
    LIFO?: boolean;
    FIFO?: boolean;
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
    backoff?: {
        type: 'fixed' | 'not fixed';
        delay: number;
    };
}
export declare class QueuePriority {
    private static baseLevel;
    static level1(): Priority;
    static level2(): Priority;
    static level3(): Priority;
    static level4(): Priority;
    static level5(): Priority;
    static level6(dto: Priority): Priority;
    static level7(): Priority;
    static level8(): Priority;
    static level9(): Priority;
    static level10(): Priority;
}
