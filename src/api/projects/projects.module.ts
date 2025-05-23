import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';
import { AwsS3SharedModule } from '../../shared/modules/aws/s3/aws-s3-shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectChat, ProjectSnapshot]), AwsS3SharedModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
