import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetDeployAppDto {
  @ApiProperty()
  @IsString()
  projectId: string;
}