import { Global, Module } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { EventBroker } from './events.broker';
import EventsManager from './events.manager';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      verboseMemoryLeak: false,
    }),
  ],
  providers: [
    EventBroker,
    {
      provide: EventsManager,
      useFactory: (eventEmitter: EventEmitter2) =>
        new EventsManager(eventEmitter),
      inject: [EventEmitter2],
    },
  ],
  exports: [EventsManager,EventBroker],
})
export class EventsManagerModule {}
