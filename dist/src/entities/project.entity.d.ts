import { ProjectChat } from './project-chat.entity';
import { ProjectSnapshot } from './project-snapshot.entity';
import { DeployAppRequest } from './deploy-app-request.entity';
export declare class Project {
    id: string;
    name: string;
    description?: string;
    category?: string;
    image?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    projectChat?: ProjectChat;
    projectSnapshot?: ProjectSnapshot;
    deployAppRequest?: DeployAppRequest;
}
