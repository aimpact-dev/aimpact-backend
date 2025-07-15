import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDeployAppRequest {
  @ApiProperty()
  @IsString()
  projectId: string;
}
