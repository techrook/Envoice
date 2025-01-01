import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
  ValidationError,
} from 'class-validator';

class EnvironmentVariables {
    @IsString()
  PORT: string;

  @IsString()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  VERSION: string;
}
/**
 * @function validate
 *
 * Validates the format of the environment variables defined in the
 * .env.${NODE_ENV} files. Throws an exception to stop the app from
 * running if their is an invalid configuration variable.
 */

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
  
    if (errors.length > 0) {
      const messages: string[] = [];
      errors.forEach((error) => {
        if (error instanceof ValidationError) {
          const message = `Abort startup w/ invalid configuration: ${error.property} equals ${error.value} is invalid`;
          messages.push(message);
        }
      });
      throw new Error(messages[0]);
    }
    return validatedConfig;
  }


export const configuration = () => ({
    port: parseInt(process.env.PORT, 10) || 3456,
    appName: process.env.APP_NAME || 'Envoice',
    version: process.env.VERSION || '1.0',
    host:
    process.env.APP_HOST || `http://localhost:${process.env.PORT || 3456}`,
    Queue: {
      url: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      user: process.env.REDIS_USERNAME,
      pass: process.env.REDIS_PASS,
      db: process.env.REDIS_DB || 'shadow-troupe',
    },
})