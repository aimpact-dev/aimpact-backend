import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { ClassType } from '../../shared/types/class.type';

export const ENV_NAMESPACE_KEYS = {
  API_SERVER: 'api_server',
  DATABASE: 'database',
  AWS: 'aws',
  CRYPTO: 'crypto',
  EMAIL: 'email',
  JWT: 'jwt',
  HELIUS: 'helius',
  BILLING: 'billing',
  REFERRALS: 'referrals',
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

export class JwtEnvironment {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;
}

export class HeliusEnvironment {
  @IsString()
  HELIUS_WEBHOOK_AUTH_HEADER: string;
}

export class BillingEnvironment {
  @IsString()
  TRACK_WALLET: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  PRICE_PER_MESSAGE_IN_SOL: number;
}

export class CryptoEnvironment {
  @IsString()
  WSS_RPC_URL: string;

  @IsString()
  HTTP_RPC_URL: string;

  @IsNumber()
  DECIMALS: number = 9;
}

export class AWSEnvironment {
  @IsString()
  AWS_REGION: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_BUCKET_NAME: string;
}

export class ReferralsEnvironment {
  @IsNumber()
  NEW_REFERRALS_DISCOUNT_PERCENT: number = 50;

  @IsNumber()
  REFERRER_FEE: number = 0.1; // 10% referrer fee

  @IsNumber()
  MESSAGES_FOR_REWARDS_MULTIPLIER: number = 2;
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

export function createEnvValidationFunction<T extends object>(envSchemaClass: ClassType<T>): () => Promise<T> {
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

export const baseEnvConfig = registerAs(ENV_NAMESPACE_KEYS.API_SERVER, createEnvValidationFunction(Environment));

export const databaseEnvConfig = registerAs(
  ENV_NAMESPACE_KEYS.DATABASE,
  createEnvValidationFunction(DatabaseEnvironment),
);

export const jwtEnvConfig = registerAs(ENV_NAMESPACE_KEYS.JWT, createEnvValidationFunction(JwtEnvironment));

export const heliusEnvConfig = registerAs(ENV_NAMESPACE_KEYS.HELIUS, createEnvValidationFunction(HeliusEnvironment));

export const awsEnvConfig = registerAs(ENV_NAMESPACE_KEYS.AWS, createEnvValidationFunction(AWSEnvironment));

export const billingEnvConfig = registerAs(ENV_NAMESPACE_KEYS.BILLING, createEnvValidationFunction(BillingEnvironment));

export const cryptoEnvConfig = registerAs(ENV_NAMESPACE_KEYS.CRYPTO, createEnvValidationFunction(CryptoEnvironment));

export const referralsEnvConfig = registerAs(ENV_NAMESPACE_KEYS.REFERRALS, createEnvValidationFunction(ReferralsEnvironment));
