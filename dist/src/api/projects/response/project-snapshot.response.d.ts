import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';
export declare class ProjectSnapshotResponse {
    projectId: string;
    files: object;
    chatIndex: string;
    summary?: string;
    updatedAt: Date;
    static fromObject(projectSnapshot: ProjectSnapshot): ProjectSnapshotResponse;
}
