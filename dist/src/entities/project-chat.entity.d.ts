export interface Message {
    id: string;
    content: string;
    role: string;
    createdAt?: Date;
}
export declare class ProjectChat {
    projectId: string;
    messages: Message[];
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
