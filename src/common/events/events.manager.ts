import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONSTANT } from '../constants/index';
import { UserRegisterEvent,UserLoginEvent, UserConfirmedMailEvent  } from './events.definitions';
// import { User } from '@prisma/client';

const { onUserRegister, onUserLogin, onEmailConfirmation } = CONSTANT;
class EventsManager {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  public onUserRegister(user: any) {
    console.log(onUserRegister);
    return this.eventEmitter.emit(onUserRegister, new UserRegisterEvent(user));
    
  }

  public onEmailConfirmationSend(user: any) {
    console.log(onEmailConfirmation);
    
    return this.eventEmitter.emit(onUserRegister, new UserRegisterEvent(user));
  }

  public onUserLogin({
    userId,
    accessToken,
    refreshToken,
  }) {
    return this.eventEmitter.emit(onUserLogin, new UserLoginEvent({
      userId,
      accessToken,
      refreshToken,
    }));
  }
  public onEmailConfirmation(userId: string) {
    console.log(onEmailConfirmation);
    
    this.eventEmitter.emit(
      onEmailConfirmation,
      new UserConfirmedMailEvent({ userId }),
    );
  } 
}

export default EventsManager;
