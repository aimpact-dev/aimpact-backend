import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { awsEnvConfig, deploymentConfig } from 'src/shared/config';
import { CircleCiClient } from './circleciClient';

@Module({
  imports: [ConfigModule.forFeature(deploymentConfig)],
  providers: [CircleCiClient],
  exports: [CircleCiClient],
})
export class AwsS3SharedModule {}
