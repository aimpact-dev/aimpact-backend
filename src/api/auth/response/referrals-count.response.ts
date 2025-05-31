import { ApiProperty } from '@nestjs/swagger';

export class ReferralsCountResponse {
  @ApiProperty({
    description: 'Number of referrals',
    example: 10,
  })
  referralsCount: number;
}
