import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { cloneEntityWithNewProps } from 'src/shared/modules/database/clone-entity-with-new-props';
import { randomUUID } from 'crypto';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';
import { ProjectResponse } from './response/project.response';

@Injectable()
export class ProjectService {
  constructor(
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

  async findAll(): Promise<ProjectResponse[]> {
    const projects = await this.projectRepository.find();
    return projects.map(ProjectResponse.fromObject);
  }

  async findOne(id: string): Promise<ProjectResponse> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return ProjectResponse.fromObject(project);
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

    return ProjectSnapshotResponse.fromObject(project.projectSnapshot);
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
      const newSnapshot = await this.projectSnapshotRepository.save({
        projectId: project.id,
        files: dto.files,
        chatIndex: dto.chatIndex,
        summary: dto.summary,
      });

      return ProjectSnapshotResponse.fromObject(newSnapshot);
    }

    const snapshot = project.projectSnapshot;

    const updatedSnapshotObject = cloneEntityWithNewProps(snapshot, {
      files: dto.files,
      chatIndex: dto.chatIndex,
      summary: dto.summary,
    });

    const updatedSnapshot = await this.projectSnapshotRepository.save(updatedSnapshotObject);

    return ProjectSnapshotResponse.fromObject(updatedSnapshot);
  }
}
