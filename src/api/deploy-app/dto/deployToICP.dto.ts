import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class DeployToICPDto {
  @IsString()
  @ApiProperty({
    description: 'The ID of the project to deploy',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  projectId: string;

  @ApiProperty({
    description: 'Snapshot of dist directory in JSON',
    type: Object,
    example: {},
  })
  @IsObject()
  snapshot: object;
}
