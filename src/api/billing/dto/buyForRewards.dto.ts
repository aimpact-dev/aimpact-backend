import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Validate } from 'class-validator';

export class BuyForRewardsDto {
  @ApiProperty({
    description: 'Amount of tokens to buy messages with. In SOL. Example: 0.001',
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
