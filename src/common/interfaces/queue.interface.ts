import { OnQueueEvent, QueueEventsHost } from '@nestjs/bullmq';
import AppLogger from 'src/common/log/logger.config';
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export abstract class IBaseWoker extends WorkerHost {
  constructor(readonly log: AppLogger) {
    super();
  }
  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.log.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.log.log(`Completed job ${job.id} of type ${job.name}.`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.log.error(
      `Failed job ${job.id} of type ${job.name} with error ${error.message}.`,
    );
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    this.log.warn(`Stalled job ${job.id} of type ${job.name}.`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.log.log(`Job ${job.id} of type ${job.name} is ${progress}% complete.`);
  }

  @OnWorkerEvent('paused')
  onPaused() {
    this.log.log(`The worker has been paused.`);
  }

  @OnWorkerEvent('resumed')
  onResumed() {
    this.log.log(`The worker has resumed.`);
  }

  @OnWorkerEvent('drained')
  onDrained() {
    this.log.log(`All jobs in the queue have been processed.`);
  }
}

export abstract class IListenToEvents extends QueueEventsHost {
  constructor(readonly log: AppLogger) {
    super();
  }
  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.log.log(`Processing job ${job.jobId}...`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; prev?: string }, failedReason: any) {
    this.log.error(
      `Failed: Job ${job.jobId} has failed with reason ${failedReason}.`,
    );
  }

  @OnQueueEvent('delayed')
  onDelayed(job: { jobId: string; prev?: string }) {
    this.log.log(`Delayed: Job ${job.jobId}...`);
  }

  @OnQueueEvent('added')
  onAdded(job: { jobId: string; prev?: string }) {
    this.log.log(`Added: Job ${job.jobId}...`);
  }

  @OnQueueEvent('resumed')
  onResumed(job: { jobId: string; prev?: string }) {
    this.log.log(`Resumed: Job ${job.jobId}...`);
  }

  @OnQueueEvent('waiting')
  onWaiting(job: { jobId: string; prev?: string }) {
    this.log.log(`Waiting: Job ${job.jobId}...`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; prev?: string }, result: any) {
    this.log.log(
      `Job ${job.jobId} completed with result: ${JSON.stringify(result)}.`,
    );
  }
}
