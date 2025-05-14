import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';
export declare class ProjectSnapshotResponse {
    projectId: string;
    files: object;
    summary?: string;
    updatedAt: Date;
    static fromObject(projectSnapshot: ProjectSnapshot): ProjectSnapshotResponse;
}
