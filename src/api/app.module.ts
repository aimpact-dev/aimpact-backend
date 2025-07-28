import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { baseEnvConfig } from 'src/shared/config';
import { PostgresSharedModule } from 'src/shared/modules/database/postgres-shared.module';
import { UserModule } from './user/user.module';
import { NonceModule } from './nonce/nonce.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import FinalExceptionFilter from 'src/shared/rest/general/final-exception.filter';
import { APP_FILTER } from '@nestjs/core';

import { DeployAppModule } from './deploy-app/deploy-app.module';
import { BillingModule } from './billing/billing.module';
import { ProxyModule } from './proxy/proxy.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LoggerSharedModule } from 'src/shared/modules/logger/logger-shared.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
const apiConfig = [baseEnvConfig];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE_PATH,
      load: apiConfig,
    }),

    // shared modules
    PostgresSharedModule,
    LoggerSharedModule,

    // api modules
    NonceModule,
    AuthModule,
    UserModule,
    BillingModule,
    ProjectsModule,
    DeployAppModule,
    ProxyModule,
    AnalyticsModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: FinalExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
