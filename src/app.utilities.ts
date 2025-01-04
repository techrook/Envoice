import { Injectable } from "@nestjs/common";
import * as argon from 'argon2';
import * as crypto from 'crypto';
import * as fs from 'fs';
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
<<<<<<< HEAD
      public static async validatePassword(
        Incomingpassword: string,
        userPassword: string,
      ) {
        return argon.verify(userPassword, Incomingpassword);
=======
      public static generateToken(len?: number): string {
        return crypto.randomBytes(len || 32).toString('hex');
      }
    
      public static generateWalletAdd(len?: number): string {
        return this.generateToken(len).toUpperCase();
      }
    
      public static hashToken(token: string, userId?: string): string {
        return crypto
          .createHash('sha256')
          .update(token + (userId || ''))
          .digest('hex');
      }
      public static readFile(filePath: string) {
        return fs.readFileSync(filePath, 'utf8');
>>>>>>> 8777fb59e156ca25f677100141cf11f5b75a3b13
      }
}