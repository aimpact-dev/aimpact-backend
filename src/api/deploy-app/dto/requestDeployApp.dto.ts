import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestDeployAppDto {
  @ApiProperty({
    description: "ID of project that user want to deploy"
  })
  @IsString()
  projectId: string;
}