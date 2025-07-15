import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, Max, Min, Length } from 'class-validator';

export class RequestFreeMessagesRequest {
  @ApiProperty({
    description: 'Twitter handle for subscription verification',
  })
  @IsString()
  @Length(4, 15)
  twitterHandle: string;
}
