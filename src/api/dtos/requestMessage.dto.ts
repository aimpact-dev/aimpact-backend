import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestMessageDto {
  @ApiProperty({
    description: 'Address of user\'s solana wallet',
  })
  @IsString()
  walletAddress: string;
}
