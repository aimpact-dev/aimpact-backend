import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { baseEnvConfig } from 'src/shared/config';
import { PostgresSharedModule } from 'src/shared/modules/database/postgres-shared.module';
import { UserModule } from './user/user.module';
import { NonceModule } from './nonce/nonce.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ProjectModule } from './project/project.module';

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

    // api modules
    NonceModule,
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
