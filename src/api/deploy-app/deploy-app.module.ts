import { Module } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { DeployAppController } from './deploy-app.controller';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeployAppRequest, Project])],
  providers: [DeployAppService],
  controllers: [DeployAppController],
})
export class DeployAppModule {}
