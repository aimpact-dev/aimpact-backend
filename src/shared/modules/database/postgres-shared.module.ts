import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseEnvConfig } from 'src/shared/config';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { PostgresConfigFactory } from './postgres-config.factory';

initializeTransactionalContext();

// eslint-disable-next-line no-console
console.log('Transactional context initialized');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseEnvConfig)],
      useClass: PostgresConfigFactory,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw Error('Datasource options missing');
        }

        return (
          getDataSourceByName('main') ||
          addTransactionalDataSource({
            name: 'main',
            dataSource: new DataSource(options),
          } as any)
        );
      },
    }),
  ],
})
export class PostgresSharedModule {}
