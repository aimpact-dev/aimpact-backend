import { Project } from './project.entity';
export declare class ProjectSnapshot {
    projectId: string;
    files: any;
    chatIndex: string;
    summary?: string;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
}
