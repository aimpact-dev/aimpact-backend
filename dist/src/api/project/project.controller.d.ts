import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectResponse } from './response/project.response';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(dto: CreateProjectDto): Promise<ProjectResponse>;
    findAll(): Promise<ProjectResponse[]>;
    findOne(id: string): Promise<ProjectResponse>;
    getChat(id: string): Promise<ProjectChatResponse>;
    upsertChat(id: string, dto: ProjectChatRequest): Promise<ProjectChatResponse>;
    getSnapshot(id: string): Promise<ProjectSnapshotResponse>;
    upsertSnapshot(id: string, dto: ProjectSnapshotRequest): Promise<ProjectSnapshotResponse>;
}
