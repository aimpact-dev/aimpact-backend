import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from '@api/projects/projects.service';
import { CreateProjectDto } from '@api/projects/dto/CreateProjectDto';
import { ProjectChatResponse } from '@api/projects/response/project-chat.response';
import { ProjectResponse } from '@api/projects/response/project.response';
import { ProjectSnapshotResponse } from '@api/projects/response/project-snapshot.response';
import { ProjectChatRequest } from '@api/projects/request/project-chat.request';
import { ProjectSnapshotRequest } from '@api/projects/request/project-snapshot.request';
import { AuthAllowed, Public } from '@api/auth/decorator/public.decorator';
import { ApiContext } from '@api/auth/decorator/api-context.decorator';
import { User } from '@entities/user.entity';
import { ProjectsFiltersRequest } from '@api/projects/request/projects-filters.request';
import { ProjectWithOwnerResponse } from '@api/projects/response/project-with-owner.response';
import ApiResponseInterceptor from '@shared/rest/general/api-response.interceptor';
import { Pagination } from '@shared/rest/pagination/pagination.decorator';
import { CursorPaginationParameters } from '@shared/rest/pagination/cursor-pagination.parameters';
import { PaginatedResponse } from '@shared/rest/pagination/paginated-response.decorator';
import { Paginated } from '@shared/rest/pagination/paginated.output';

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
  @PaginatedResponse(ProjectResponse, 'cursor')
  async findAll(
    @Query() filters: ProjectsFiltersRequest,
    @Pagination({ type: 'cursor' }) pagination: CursorPaginationParameters,
    @ApiContext({ required: false }) user?: User,
  ): Promise<Paginated<ProjectResponse>> {
    return this.projectService.findAll(filters, pagination, user);
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
    description: 'Get project snapshot',
    type: ProjectSnapshotResponse,
  })
  @ApiBearerAuth()
  async getSnapshot(@ApiContext() user: User, @Param('id') id: string): Promise<ProjectSnapshotResponse | null> {
    return this.projectService.getSnapshot(id, user.id);
  }

  @Post(':id/snapshot')
  @ApiResponse({
    status: 200,
    description: 'Upsert project snapshot',
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
