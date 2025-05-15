import { Project } from 'src/entities/project.entity';
export declare class ProjectResponse {
    id: string;
    name: string;
    description?: string;
    category?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    static fromObject(project: Project): ProjectResponse;
}
