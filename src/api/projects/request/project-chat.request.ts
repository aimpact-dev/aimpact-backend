import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ProjectChatRequest {
  @ApiProperty()
  @IsArray()
  messages: any[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: object;
}
