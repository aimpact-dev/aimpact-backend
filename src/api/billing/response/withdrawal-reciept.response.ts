import { ApiProperty } from '@nestjs/swagger';

export class WithdrawalReceiptResponse {
  @ApiProperty({
    description: 'The withdrawal receipt uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Amount withdrawn by the user in solana',
    example: '0.01',
  })
  amount: number;

  @ApiProperty({
    description: 'The transaction hash of the withdrawal',
    example: '5K9z1d3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0',
  })
  transactionHash: string;

  @ApiProperty({
    description: 'The date when the withdrawal receipt was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;
}
