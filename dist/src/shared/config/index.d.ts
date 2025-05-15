import { ClassType } from '../../shared/types/class.type';
export declare const ENV_NAMESPACE_KEYS: {
    API_SERVER: string;
    DATABASE: string;
    AWS: string;
    CRYPTO: string;
    EMAIL: string;
    JWT: string;
};
export declare class Environment {
    PORT: number;
    NODE_ENV: string;
}
export declare class DatabaseEnvironment {
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
}
export declare class JwtEnvironment {
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
}
export declare const envLoad: () => any;
export declare function createEnvValidationFunction<T extends object>(envSchemaClass: ClassType<T>): () => Promise<T>;
export declare const baseEnvConfig: (() => Promise<Environment>) & import("@nestjs/config").ConfigFactoryKeyHost<Promise<Environment>>;
export declare const databaseEnvConfig: (() => Promise<DatabaseEnvironment>) & import("@nestjs/config").ConfigFactoryKeyHost<Promise<DatabaseEnvironment>>;
export declare const jwtEnvConfig: (() => Promise<JwtEnvironment>) & import("@nestjs/config").ConfigFactoryKeyHost<Promise<JwtEnvironment>>;
