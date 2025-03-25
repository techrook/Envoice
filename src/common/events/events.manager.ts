import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONSTANT } from '../constants/index';
import { UserRegisterEvent,UserLoginEvent, UserConfirmedMailEvent, PassChangeSuccess, PasswordResetEvent,BusinessProfileCreatedEvent,  } from './events.definitions';
import { User } from '@prisma/client';
import { Priority } from './events.interface';
// import { User } from '@prisma/client';

const { onUserRegister, onUserLogin, onEmailConfirmation, onPasswordReset, onPasswordChange,onBusinessProfileCreated } = CONSTANT;
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
      new PasswordResetEvent(user, priority)
    );
  }

  public onPasswordChange(user: User, priority: Priority) {
    try {
      this.eventEmitter.emit(
        onPasswordChange,
        new PassChangeSuccess(user, priority),
      );
    } catch (error) {
      console.log(error);
    }
  }

  public onBusinessProfileCreated(userId: string, file: Express.Multer.File) {
    console.log('Business Profile Created');
    return this.eventEmitter.emit(onBusinessProfileCreated,new BusinessProfileCreatedEvent(userId, file))
  }
  
}

export default EventsManager;
