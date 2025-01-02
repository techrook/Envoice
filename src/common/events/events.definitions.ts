import { User } from '@prisma/client';
import {Priority} from './events.interface'


export abstract class BaseEventDefinition {
  constructor(public Priority?: Priority) {}
}



export class UserRegisterEvent {
  constructor(
    public payload: { id: string; email: string; username: string },
  ) {}
}

