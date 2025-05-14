export declare class MessageRequest {
    id?: string;
    content: string;
    role: string;
}
export declare class ProjectChatRequest {
    messages: MessageRequest[];
    metadata?: object;
}
