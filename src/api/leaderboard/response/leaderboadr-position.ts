import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardPositionResponseDto {
  @ApiProperty()
  points: number;

  @ApiProperty()
  position: number;
}
