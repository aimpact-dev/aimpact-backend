import { ApiProperty } from '@nestjs/swagger';

export class AddPointsResponseDto {
  @ApiProperty()
  points: number;
}
