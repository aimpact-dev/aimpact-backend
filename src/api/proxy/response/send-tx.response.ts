import { ApiProperty } from '@nestjs/swagger';

export class SendTxResponse {
  @ApiProperty({
    description: 'The transaction hash',
    example: '1234567890',
  })
  txHash: string;
}
