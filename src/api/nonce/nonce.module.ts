import { Module } from '@nestjs/common';
import { NonceService } from './nonce.service';
import { NonceController } from './nonce.controller';

@Module({
  providers: [NonceService],
  controllers: [NonceController]
})
export class NonceModule {}
