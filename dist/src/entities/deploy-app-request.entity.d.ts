import { Project } from './project.entity';
type DeploymentStatus = "QUEUED" | "BUILDING" | "ERROR" | "INITIALIZING" | "READY" | "CANCELED";
export declare class DeployAppRequest {
    projectId: string;
    deploymentId: string;
    status: DeploymentStatus;
    isDeployed: boolean;
    message?: string;
    finalUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    project?: Project;
}
export {};
