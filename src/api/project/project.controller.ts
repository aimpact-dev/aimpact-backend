import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectResponse } from './response/project.response';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectService.create(dto);
  }

  @Get()
  async findAll(): Promise<ProjectResponse[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.findOne(id);
  }

  @Get(':id/chat')
  async getChat(@Param('id') id: string): Promise<ProjectChatResponse> {
    return this.projectService.getChat(id);
  }

  @Post(':id/chat')
  async upsertChat(@Param('id') id: string, @Body() dto: ProjectChatRequest): Promise<ProjectChatResponse> {
    return this.projectService.upsertChat(id, dto);
  }

  @Get(':id/snapshot')
  async getSnapshot(@Param('id') id: string): Promise<ProjectSnapshotResponse> {
    return this.projectService.getSnapshot(id);
  }

  @Post(':id/snapshot')
  async upsertSnapshot(@Param('id') id: string, @Body() dto: ProjectSnapshotRequest): Promise<ProjectSnapshotResponse> {
    return this.projectService.upsertSnapshot(id, dto);
  }
}
