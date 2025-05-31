import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendTxRequest {
  @ApiProperty({
    description: 'The serialized transaction to send',
  })
  @IsString()
  @IsNotEmpty()
  serializedTx: string;
}
