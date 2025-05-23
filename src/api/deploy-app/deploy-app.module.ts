import { Module } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { DeployAppController } from './deploy-app.controller';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { AwsS3SharedModule } from '../../shared/modules/aws/s3/aws-s3-shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeployAppRequest, Project]), AwsS3SharedModule],
  providers: [DeployAppService],
  controllers: [DeployAppController],
})
export class DeployAppModule {}
