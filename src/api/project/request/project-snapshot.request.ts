import { IsDate, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectSnapshotRequest {
  @ApiProperty()
  @IsNotEmptyObject()
  files: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatIndex: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  summary?: string;
}
