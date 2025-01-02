import { Module } from '@nestjs/common';
import {
    SignUpConsumer,
  } from './consumers/auth.consumer';
  import {
    SignUpEventListener,
  } from './queue.listener';
@Module({
    providers: [
        SignUpConsumer,],
    
    imports:[],
})
export class QueueModule {}
