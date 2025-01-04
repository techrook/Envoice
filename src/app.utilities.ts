import { Injectable } from "@nestjs/common";
import * as argon from 'argon2';
@Injectable()
export class AppUtilities {
    public static async hashPassword(password: string): Promise<string> {
        try {
          const hashedPassword = await argon.hash(password);
          return hashedPassword;
        } catch (error) {
          throw new Error('Oops! Something went wrong!');
        }
      }

      public static decode(
        data: string,
        encoding: BufferEncoding = 'base64',
      ): string {
        return Buffer.from(data, encoding).toString();
      }

      public static encode(
        data: string,
        encoding: BufferEncoding = 'base64',
      ): string {
        return Buffer.from(data).toString(encoding);
      }
      public static async validatePassword(
        Incomingpassword: string,
        userPassword: string,
      ) {
        return argon.verify(userPassword, Incomingpassword);
      }
}