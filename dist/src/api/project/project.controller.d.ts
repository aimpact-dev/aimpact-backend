import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/CreateProjectDto';
import { ProjectChatResponse } from './response/project-chat.response';
import { ProjectResponse } from './response/project.response';
import { ProjectSnapshotResponse } from './response/project-snapshot.response';
import { ProjectChatRequest } from './request/project-chat.request';
import { ProjectSnapshotRequest } from './request/project-snapshot.request';
import { User } from 'src/entities/user.entity';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(user: User, dto: CreateProjectDto): Promise<ProjectResponse>;
    findAll(): Promise<ProjectResponse[]>;
    findOne(id: string): Promise<ProjectResponse>;
    getChat(user: User, id: string): Promise<ProjectChatResponse>;
    upsertChat(user: User, id: string, dto: ProjectChatRequest): Promise<ProjectChatResponse>;
    getSnapshot(user: User, id: string): Promise<ProjectSnapshotResponse | null>;
    upsertSnapshot(user: User, id: string, dto: ProjectSnapshotRequest): Promise<ProjectSnapshotResponse>;
}
