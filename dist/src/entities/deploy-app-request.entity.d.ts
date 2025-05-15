import { Project } from "./project.entity";
export declare class DeployAppRequest {
    id: string;
    isDeployed: boolean;
    message?: string;
    finalUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    project?: Project;
}
