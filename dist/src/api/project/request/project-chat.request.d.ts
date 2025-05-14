export declare class MessageRequest {
    id?: string;
    content: string;
    role: string;
    annotations?: any[];
}
export declare class ProjectChatRequest {
    messages: MessageRequest[];
    metadata?: object;
}
