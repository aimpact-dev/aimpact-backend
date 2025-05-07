import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { baseEnvConfig, databaseEnvConfig } from 'src/shared/config';

@Injectable()
export class PostgresConfigFactory implements TypeOrmOptionsFactory {
  constructor(
    @Inject(baseEnvConfig.KEY)
    private readonly baseConfig: ConfigType<typeof baseEnvConfig>,
    @Inject(databaseEnvConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof databaseEnvConfig>,
  ) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.databaseConfig.DATABASE_HOST || 'localhost',
      port: this.databaseConfig.DATABASE_PORT || 5432,
      username: this.databaseConfig.DATABASE_USER,
      password: this.databaseConfig.DATABASE_PASSWORD,
      database: this.databaseConfig.DATABASE_NAME,
      entities: [`${__dirname}/../entities/*.entity{.ts,.js}`],
      synchronize: this.baseConfig.NODE_ENV === 'development',
      logging: this.baseConfig.NODE_ENV === 'development',
      migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
    };
  }
}
