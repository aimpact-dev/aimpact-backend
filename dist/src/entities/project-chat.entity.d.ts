import { Project } from './project.entity';
export interface Message {
    id: string;
    content: string;
    role: string;
    annotations?: any;
    createdAt?: Date;
}
export declare class ProjectChat {
    projectId: string;
    description?: string;
    messages: any[];
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
}
