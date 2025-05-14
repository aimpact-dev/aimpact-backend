import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectChat, ProjectSnapshot])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
