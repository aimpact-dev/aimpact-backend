import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { baseEnvConfig } from 'src/shared/config';
import { PostgresSharedModule } from 'src/shared/modules/database/postgres-shared.module';
import { UserModule } from './user/user.module';
import { NonceModule } from './nonce/nonce.module';

const apiConfig = [baseEnvConfig];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE_PATH,
      load: apiConfig,
    }),
    PostgresSharedModule,
    NonceModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
