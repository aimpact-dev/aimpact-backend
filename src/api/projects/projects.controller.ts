import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectResponse } from './response/project.response';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
import { Public } from '../auth/decorator/public.decorator';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  async create(@ApiContext() user: User, @Body() dto: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectService.create(user.id, dto);
  }

  @Public()
  @Get()
  async findAll(): Promise<ProjectResponse[]> {
    return this.projectService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {
    return this.projectService.findOne(id);
  }

  @Get(':id/chat')
  async getChat(@ApiContext() user: User, @Param('id') id: string): Promise<ProjectChatResponse> {
    return this.projectService.getChat(id, user.id);
  }

  @Post(':id/chat')
  async upsertChat(
    @ApiContext() user: User,
    @Param('id') id: string,
    @Body() dto: ProjectChatRequest,
  ): Promise<ProjectChatResponse> {
    return this.projectService.upsertChat(id, user.id, dto);
  }

  @Get(':id/snapshot')
  async getSnapshot(@ApiContext() user: User, @Param('id') id: string): Promise<ProjectSnapshotResponse | null> {
    return this.projectService.getSnapshot(id, user.id);
  }

  @Post(':id/snapshot')
  async upsertSnapshot(
    @ApiContext() user: User,
    @Param('id') id: string,
    @Body() dto: ProjectSnapshotRequest,
  ): Promise<ProjectSnapshotResponse> {
    return this.projectService.upsertSnapshot(id, user.id, dto);
  }
}
