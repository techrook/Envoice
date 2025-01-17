import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONSTANT } from '../constants/index';
import { UserRegisterEvent,UserLoginEvent, UserConfirmedMailEvent, PasswordResetEvent  } from './events.definitions';
import { User } from '@prisma/client';
import { Priority } from './events.interface';
// import { User } from '@prisma/client';

const { onUserRegister, onUserLogin, onEmailConfirmation, onPasswordReset } = CONSTANT;
class EventsManager {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  public onUserRegister(user: any) {
    return this.eventEmitter.emit(onUserRegister, new UserRegisterEvent(user));
    
  }

  public onEmailConfirmationSend(user: any) {
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
    return this.eventEmitter.emit(
      onEmailConfirmation,
      new UserConfirmedMailEvent({ userId }),
    );
  }
  public onPasswordReset(user: User, priority: Priority){
    return this.eventEmitter.emit(onPasswordReset, 
      new PasswordResetEvent({ user, priority })
    );
  } 
}

export default EventsManager;
