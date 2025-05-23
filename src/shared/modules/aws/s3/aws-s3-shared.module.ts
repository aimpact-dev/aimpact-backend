import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { awsEnvConfig } from 'src/shared/config';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule.forFeature(awsEnvConfig)],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsS3SharedModule {}
