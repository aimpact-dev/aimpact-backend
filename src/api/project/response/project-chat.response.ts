import { ApiProperty } from '@nestjs/swagger';
import { Message, ProjectChat } from 'src/entities/project-chat.entity';

export class MessageResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ nullable: true })
  createdAt?: Date;

  static fromObject(message: Message): MessageResponse {
    return {
      id: message.id,
      content: message.content,
      role: message.role,
      createdAt: message.createdAt,
    };
  }
}

export class ProjectChatResponse {
  @ApiProperty()
  projectId: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ type: [MessageResponse] })
  messages: MessageResponse[];

  @ApiProperty({ nullable: true })
  metadata?: any;

  @ApiProperty()
  createdAt: Date;

  static fromObject(projectChat: ProjectChat): ProjectChatResponse {
    return {
      projectId: projectChat.projectId,
      description: projectChat.description,
      messages: projectChat.messages.map(MessageResponse.fromObject),
      metadata: projectChat.metadata,
      createdAt: projectChat.createdAt,
    };
  }
}
