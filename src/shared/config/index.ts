import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { ClassType } from 'src/shared/types/class.type';

export const ENV_NAMESPACE_KEYS = {
  API_SERVER: 'api_server',
  DATABASE: 'database',
  aws: 'aws',
  crypto: 'crypto',
  email: 'email',
};

export class Environment {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  PORT = 80;

  @IsString()
  NODE_ENV: string;
}

export class DatabaseEnvironment {
  @IsString()
  DATABASE_HOST: string = 'localhost';

  @IsNumber()
  @Transform(({ value }) => Number(value))
  DATABASE_PORT: number = 2345;

  @IsString()
  DATABASE_USER: string = 'postgres';

  @IsString()
  DATABASE_PASSWORD: string = 'postgres';

  @IsString()
  DATABASE_NAME: string = 'aimpact';
}

const logger = new Logger('ENV logger');
let env: Record<string, any> = {};

export const envLoad = (): any => {
  logger.log('ENVS LOADED');
  env = {
    ...env,
    ...process.env,
    LOADED: 'true',
  };

  return env;
};

export function createEnvValidationFunction<T extends object>(
  envSchemaClass: ClassType<T>,
): () => Promise<T> {
  return async () => {
    const validatedConfig = plainToInstance(envSchemaClass, env, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, { whitelist: true });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  };
}

export const baseEnvConfig = registerAs(
  ENV_NAMESPACE_KEYS.API_SERVER,
  createEnvValidationFunction(Environment),
);

export const databaseEnvConfig = registerAs(
  ENV_NAMESPACE_KEYS.DATABASE,
  createEnvValidationFunction(DatabaseEnvironment),
);
