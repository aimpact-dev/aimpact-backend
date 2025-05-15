import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestDeployAppDto {
  @ApiProperty({
    description: ""
  })
  @IsString()
  projectId: string;
}