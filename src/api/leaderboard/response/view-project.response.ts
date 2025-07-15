import { ApiProperty } from '@nestjs/swagger';

export class ViewProjectResponseDto {
  @ApiProperty()
  views: number;

  @ApiProperty()
  points: number;

  @ApiProperty({ type: 'string', format: 'uuid' })
  projectId: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  userId: string;
}
