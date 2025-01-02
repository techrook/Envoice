import { QueueEventsListener } from '@nestjs/bullmq';
import { IListenToEvents } from 'src/common/interfaces/queue.interface';
import AppLogger from 'src/common/log/logger.config';
// import { CONSTANT } from 'src/common/constants';
// const {  PlaylistQ } = CONSTANT;
@QueueEventsListener('SignUpJobs')
export class SignUpEventListener extends IListenToEvents {
  constructor(log: AppLogger) {
    super(log);
  }
}


