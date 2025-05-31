import { ApiProperty } from '@nestjs/swagger';


export class UserMeResponse {
  @ApiProperty({
    description: 'The user uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The user wallet address',
    example: '7HmYsWHYZzixB3px79Y9sx91puwvLtv4ikLB9evx1vX4',
  })
  wallet: string;

  @ApiProperty({
    description: 'Messages left for the user',
    example: 3,
  })
  messagesLeft: number;

  @ApiProperty({
    description: 'User invite code for referrals. 6 characters long, alphanumeric (a-z, A-Z, 0-9)',
    example: 'abC123',
  })
  inviteCode: string;

  @ApiProperty({
    description: 'Discount percent for the user, used for billing',
    example: 50,
  })
  discountPercent: number;

  @ApiProperty({
    description: 'Total rewards earned by the user from referrals, in SOL',
    example: 0.01,
  })
  referralsRewards: number;

  @ApiProperty({
    description: 'Whether the user has claimed their free messages',
    example: true,
  })
  claimedFreeMessages: boolean;
}