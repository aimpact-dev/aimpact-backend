import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min, Validate } from 'class-validator';

export class UserGradeDto {
  @ApiProperty({
    description: 'Grade from 0 to 10 of application by user',
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  grade: number;
}
