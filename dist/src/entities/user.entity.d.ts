import { Project } from './project.entity';
export declare class User {
    id: string;
    wallet: string;
    createdAt: Date;
    updatedAt: Date;
    projects: Project[];
}
