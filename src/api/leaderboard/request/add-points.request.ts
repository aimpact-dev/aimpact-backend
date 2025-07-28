import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';
import { RankTypes } from '../utils/rank-system';
import { PointsValid } from 'src/shared/validators/points.validator';

export class AddPointsRequest {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ nullable: false })
  @Validate(PointsValid)
  points: number;

  @ApiProperty()
  @IsEnum(RankTypes)
  eventType: RankTypes;
}
