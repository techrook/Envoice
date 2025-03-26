import { QueueEventsListener } from '@nestjs/bullmq';
import { IListenToEvents } from 'src/common/interfaces/queue.interface';
import AppLogger from 'src/common/log/logger.config';

@QueueEventsListener('SignUpJobs')
export class SignUpEventListener extends IListenToEvents {
  constructor(log: AppLogger) {
    super(log);
  }
}

@QueueEventsListener('BusinessJobs')
export class BusinessEventListener extends IListenToEvents {
  constructor(log: AppLogger) {
    super(log);
  }
}