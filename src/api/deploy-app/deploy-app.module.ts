import { Module } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { DeployAppController } from './deploy-app.controller';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { AwsS3SharedModule } from '../../shared/modules/aws/s3/aws-s3-shared.module';
import { CircleCiSharedModule } from '../../shared/modules/circleci/circleci-shared.module';
import { S3Deployment } from '../../entities/deploy-s3.entity';
import { ConfigModule } from '@nestjs/config';
import { deploymentConfig, servicesEnvConfig } from '../../shared/config';

@Module({
  imports: [TypeOrmModule.forFeature([DeployAppRequest, Project, S3Deployment]), AwsS3SharedModule, CircleCiSharedModule, ConfigModule.forFeature(deploymentConfig), ConfigModule.forFeature(servicesEnvConfig)],
  providers: [DeployAppService],
  controllers: [DeployAppController],
})
export class DeployAppModule {}
