import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectChat, ProjectSnapshot])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
