import { ApiProperty } from '@nestjs/swagger';

export class PendingMessagesResponse {
  @ApiProperty({
    description: 'Number of pending messages',
    example: 10,
  })
  pendingMessages: number;
}
