import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { baseEnvConfig, databaseEnvConfig } from 'src/shared/config';
export declare class PostgresConfigFactory implements TypeOrmOptionsFactory {
    private readonly baseConfig;
    private readonly databaseConfig;
    constructor(baseConfig: ConfigType<typeof baseEnvConfig>, databaseConfig: ConfigType<typeof databaseEnvConfig>);
    createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
}
