import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageRequest {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class ProjectChatRequest {
  @ApiProperty({ type: [MessageRequest] })
  @IsArray({ each: true })
  messages: MessageRequest[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: object;
}
