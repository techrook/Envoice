import { QueueEventsHost } from '@nestjs/bullmq';
import AppLogger from 'src/common/log/logger.config';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare abstract class IBaseWoker extends WorkerHost {
    readonly log: AppLogger;
    constructor(log: AppLogger);
    onActive(job: Job): void;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, error: Error): void;
    onStalled(job: Job): void;
    onProgress(job: Job, progress: number | object): void;
    onPaused(): void;
    onResumed(): void;
    onDrained(): void;
}
export declare abstract class IListenToEvents extends QueueEventsHost {
    readonly log: AppLogger;
    constructor(log: AppLogger);
    onActive(job: {
        jobId: string;
        prev?: string;
    }): void;
    onFailed(job: {
        jobId: string;
        prev?: string;
    }, failedReason: any): void;
    onDelayed(job: {
        jobId: string;
        prev?: string;
    }): void;
    onAdded(job: {
        jobId: string;
        prev?: string;
    }): void;
    onResumed(job: {
        jobId: string;
        prev?: string;
    }): void;
    onWaiting(job: {
        jobId: string;
        prev?: string;
    }): void;
    onCompleted(job: {
        jobId: string;
        prev?: string;
    }, result: any): void;
}
