import { ApiProperty } from '@nestjs/swagger';

export class RecentBlockhashResponse {
  @ApiProperty({
    description: 'The recent blockhash',
    example: '1234567890',
  })
  blockhash: string;

  @ApiProperty({
    description: 'The last valid block height',
    example: 1234567890,
  })
  lastValidBlockHeight: number;
}
