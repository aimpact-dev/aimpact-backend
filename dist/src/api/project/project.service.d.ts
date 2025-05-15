import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChat } from 'src/entities/project-chat.entity';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';
import { ProjectResponse } from './response/project.response';
export declare class ProjectService {
    private readonly projectRepository;
    private readonly projectChatRepository;
    private readonly projectSnapshotRepository;
    constructor(projectRepository: Repository<Project>, projectChatRepository: Repository<ProjectChat>, projectSnapshotRepository: Repository<ProjectSnapshot>);
    create(dto: CreateProjectDto): Promise<ProjectResponse>;
    findAll(): Promise<ProjectResponse[]>;
    findOne(id: string): Promise<ProjectResponse>;
    getChat(projectId: string): Promise<ProjectChatResponse>;
    upsertChat(projectId: string, dto: ProjectChatRequest): Promise<ProjectChatResponse>;
    getSnapshot(projectId: string): Promise<ProjectSnapshotResponse>;
    upsertSnapshot(projectId: string, dto: ProjectSnapshotRequest): Promise<ProjectSnapshotResponse>;
}
