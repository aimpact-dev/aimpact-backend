import { ApiProperty } from '@nestjs/swagger';

export class MessagesLeftResponse {
  @ApiProperty({
    description: 'Number of messages left',
    example: 10,
  })
  messagesLeft: number;
}
