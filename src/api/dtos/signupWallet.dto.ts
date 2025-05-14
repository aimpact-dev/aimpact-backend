import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupWalletDto {
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
}
