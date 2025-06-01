import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectResponse } from './response/project.response';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
import { AuthAllowed, Public } from '../auth/decorator/public.decorator';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsFiltersRequest } from './request/projects-filters.request';
import { WithdrawalReceiptResponse } from '../billing/response/withdrawal-reciept.response';
import { ProjectWithOwnerResponse } from './response/project-with-owner.response';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  @ApiBearerAuth()
  async create(@ApiContext() user: User, @Body() dto: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectService.create(user.id, dto);
  }

  @Public()
  @AuthAllowed()
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiBearerAuth()
  async findAll(@Query() filters: ProjectsFiltersRequest, @ApiContext({ required: false }) user?: User): Promise<ProjectResponse[]> {
    return this.projectService.findAll(filters, user);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectWithOwnerResponse> {
    return this.projectService.findOne(id);
  }

  @Get(':id/chat')
  @ApiBearerAuth()
  async getChat(@ApiContext() user: User, @Param('id') id: string): Promise<ProjectChatResponse> {
    return this.projectService.getChat(id, user.id);
  }

  @Post(':id/chat')
  @ApiBearerAuth()
  async upsertChat(
    @ApiContext() user: User,
    @Param('id') id: string,
    @Body() dto: ProjectChatRequest,
  ): Promise<ProjectChatResponse> {
    return this.projectService.upsertChat(id, user.id, dto);
  }

  @Get(':id/snapshot')
  @ApiResponse({
    status: 200,
    description: "Get project snapshot",
    type: ProjectSnapshotResponse,
  })
  @ApiBearerAuth()
  async getSnapshot(@ApiContext() user: User, @Param('id') id: string): Promise<ProjectSnapshotResponse | null> {
    return this.projectService.getSnapshot(id, user.id);
  }

  @Post(':id/snapshot')
  @ApiResponse({
    status: 200,
    description: "Upsert project snapshot",
    type: ProjectSnapshotResponse,
  })
  @ApiBearerAuth()
  async upsertSnapshot(
    @ApiContext() user: User,
    @Param('id') id: string,
    @Body() dto: ProjectSnapshotRequest,
  ): Promise<ProjectSnapshotResponse> {
    return this.projectService.upsertSnapshot(id, user.id, dto);
  }
}
