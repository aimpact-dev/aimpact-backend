import { ApiProperty } from '@nestjs/swagger';

export class UserWalletDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @ApiProperty()
  wallet: string;
}

export class PositionInfoDto {
  @ApiProperty()
  points: number;

  @ApiProperty({ type: () => UserWalletDto })
  user: UserWalletDto;
}

export class LeaderboardMetaDto {
  @ApiProperty()
  pointsInTop: number;

  @ApiProperty()
  totalCount: number;
}

export class LeaderboardTopResponseDto {
  @ApiProperty({ type: () => [PositionInfoDto] })
  positions: PositionInfoDto[];

  @ApiProperty({ type: () => LeaderboardMetaDto })
  meta: LeaderboardMetaDto;
}
