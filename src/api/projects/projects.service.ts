import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Project } from '@entities/project.entity';
import { CreateProjectDto } from '@api/projects/dto/CreateProjectDto';
import { ProjectChat } from '@entities/project-chat.entity';
import { ProjectChatResponse } from '@api/projects/response/project-chat.response';
import { ProjectChatRequest } from '@api/projects/request/project-chat.request';
import { cloneEntityWithNewProps } from '@shared/modules/database/clone-entity-with-new-props';
import { randomUUID } from 'crypto';
import { ProjectSnapshotResponse } from '@api/projects/response/project-snapshot.response';
import { ProjectSnapshotRequest } from '@api/projects/request/project-snapshot.request';
import { ProjectSnapshot } from '@entities/project-snapshot.entity';
import { ProjectResponse } from '@api/projects/response/project.response';
import { S3Service } from '@shared/modules/aws/s3/s3.service';
import { ProjectsFiltersRequest, ProjectOwnership } from '@api/projects/request/projects-filters.request';
import { User } from '@entities/user.entity';
import { ProjectWithOwnerResponse } from '@api/projects/response/project-with-owner.response';
import { Paginated } from '@shared/rest/pagination/paginated.output';
import { CursorPaginationParameters } from '@shared/rest/pagination/cursor-pagination.parameters';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly s3Client: S3Service,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectChat)
    private readonly projectChatRepository: Repository<ProjectChat>,
    @InjectRepository(ProjectSnapshot)
    private readonly projectSnapshotRepository: Repository<ProjectSnapshot>,
  ) {}

  async create(userId: string, dto: CreateProjectDto): Promise<ProjectResponse> {
    const project = this.projectRepository.create({ ...dto, userId });
    const savedProject = await this.projectRepository.save(project);
    return ProjectResponse.fromObject(savedProject);
  }

  async findAll(
    filters: ProjectsFiltersRequest,
    pagination: CursorPaginationParameters,
    user?: User,
  ): Promise<Paginated<ProjectResponse>> {
    if (!user && filters.ownership === ProjectOwnership.OWNED) {
      throw new UnauthorizedException('User is required to filter by ownership');
    }

    const whereFilters = {
      ...(filters.ownership === ProjectOwnership.OWNED ? { userId: user?.id } : {}),
    };

    let cursorProject: Project | null = null;
    if (pagination.cursor && pagination.cursor.id) {
      cursorProject = await this.projectRepository.findOne({
        where: { id: pagination.cursor.id },
        select: ['createdAt'],
      });
    }

    const [projects, projectsCount] = await Promise.all([
      this.projectRepository.find({
        where: {
          ...whereFilters,
          ...(cursorProject ? { createdAt: LessThan(cursorProject.createdAt) } : {}),
        },
        take: pagination.take ?? undefined,
        order: { createdAt: 'DESC' },
      }),
      this.projectRepository.count({ where: whereFilters }),
    ]);

    return Paginated.fromObject(projects.map(ProjectResponse.fromObject), ['id'], pagination, projectsCount);
  }

  async findOne(id: string): Promise<ProjectWithOwnerResponse> {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['user'] });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return ProjectWithOwnerResponse.fromObject(project);
  }

  async getChat(projectId: string, userId: string): Promise<ProjectChatResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId },
      relations: ['projectChat'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    if (!project.projectChat) {
      throw new NotFoundException(`Project with ID ${projectId} has no chat`);
    }

    return ProjectChatResponse.fromObject(project.projectChat);
  }

  async upsertChat(projectId: string, userId: string, dto: ProjectChatRequest): Promise<ProjectChatResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId },
      relations: ['projectChat'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (!project.projectChat) {
      const newChat = await this.projectChatRepository.save({
        projectId: project.id,
        description: dto.description,
        messages: dto.messages,
        metadata: dto.metadata,
      });

      return ProjectChatResponse.fromObject(newChat);
    }

    const chat = project.projectChat;

    const updatedChatObject = cloneEntityWithNewProps(chat, {
      messages: dto.messages.map((message) => ({
        id: message.id ?? randomUUID(),
        ...message,
      })),
      description: dto.description,
      metadata: dto.metadata,
    });

    const updatedChat = await this.projectChatRepository.save(updatedChatObject);

    return ProjectChatResponse.fromObject(updatedChat);
  }

  async getSnapshot(projectId: string, userId: string): Promise<ProjectSnapshotResponse | null> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId },
      relations: ['projectSnapshot', 'projectChat'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    if (!project.projectChat) {
      throw new NotFoundException(`Project with ID ${projectId} has no chat`);
    }
    if (!project.projectSnapshot) {
      return null;
    }

    if (!project.projectSnapshot.filesPath) {
      throw new NotFoundException(`Project with ID ${projectId} has no snapshot`);
    }

    const filesPath = project.projectSnapshot.filesPath;
    const files = await this.s3Client.downloadObjectFromFile(filesPath);
    if (!files) {
      throw new NotFoundException(`Project with ID ${projectId} has no snapshot`);
    }

    return ProjectSnapshotResponse.fromObject({
      ...(project.projectSnapshot as Omit<ProjectSnapshot, 'filesPath'>),
      files: files,
    });
  }

  async upsertSnapshot(
    projectId: string,
    userId: string,
    dto: ProjectSnapshotRequest,
  ): Promise<ProjectSnapshotResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId },
      relations: ['projectSnapshot', 'projectChat'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    if (!project.projectChat) {
      throw new NotFoundException(`Project with ID ${projectId} has no chat`);
    }

    if (!project.projectSnapshot) {
      if (!dto.files) {
        throw new BadRequestException('Files are required to create a snapshot');
      }
      const filesPath = `projects/${projectId}/snapshots/${randomUUID()}`;
      // dto.files is a json string with has to be saved to s3 object

      const files = JSON.stringify(dto.files);
      await this.s3Client.uploadTextFile(filesPath, files);
      const newSnapshot = await this.projectSnapshotRepository.save({
        projectId: project.id,
        filesPath: filesPath,
        chatIndex: dto.chatIndex,
        summary: dto.summary,
      });

      return ProjectSnapshotResponse.fromObject({
        ...(newSnapshot as Omit<ProjectSnapshot, 'filesPath'>),
        files: dto.files,
      });
    }

    const snapshot = project.projectSnapshot;
    if (!dto.files) {
      throw new BadRequestException('Files are required to update a snapshot');
    }
    const filesPath = snapshot.filesPath;
    const files = JSON.stringify(dto.files);
    await this.s3Client.uploadTextFile(filesPath, files);

    const updatedSnapshotObject = cloneEntityWithNewProps(snapshot, {
      chatIndex: dto.chatIndex,
      summary: dto.summary,
    });

    const updatedSnapshot = await this.projectSnapshotRepository.save(updatedSnapshotObject);

    return ProjectSnapshotResponse.fromObject({
      ...(updatedSnapshot as Omit<ProjectSnapshot, 'filesPath'>),
      files: dto.files,
    });
  }
}
