import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninWalletDto {
  @ApiProperty({
    description: 'Signed message by Solana wallet',
  })
  @IsString()
  signedMessage: string;

  @ApiProperty({
    description: 'Address of solana wallet which signed the message',
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'Uniq nonce which was used in the message',
  })
  @IsString()
  nonce: string;
}
