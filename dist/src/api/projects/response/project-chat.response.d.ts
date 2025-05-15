import { Message, ProjectChat } from 'src/entities/project-chat.entity';
export declare class MessageResponse {
    id: string;
    content: string;
    role: string;
    createdAt?: Date;
    static fromObject(message: Message): MessageResponse;
}
export declare class ProjectChatResponse {
    projectId: string;
    description?: string;
    messages: MessageResponse[];
    metadata?: any;
    createdAt: Date;
    static fromObject(projectChat: ProjectChat): ProjectChatResponse;
}
