import { EventEmitter2 } from '@nestjs/event-emitter';
import {CONSTANT} from '../constants/index'
import {

    UserRegisterEvent,
  } from './events.definitions';
// import { User } from '@prisma/client';
  
const {
    onUserRegister,
  } = CONSTANT;
class EventsManager {
    constructor(private readonly eventEmitter: EventEmitter2) {}
    public onUserRegister(user: any) {
      console.log('user', user)
      return this.eventEmitter.emit(onUserRegister, new UserRegisterEvent(user));
    }
  
    public onEmailConfirmationSend(user: any) {
      return this.eventEmitter.emit(onUserRegister, new UserRegisterEvent(user));
    }
}

export default EventsManager;