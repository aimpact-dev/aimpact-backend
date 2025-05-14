import { Module } from '@nestjs/common';
import { NonceService } from './nonce.service';
import { NonceController } from './nonce.controller';
import { Nonce } from 'src/entities/nonce.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Nonce])],
  providers: [NonceService],
  controllers: [NonceController],
  exports: [NonceService],
})
export class NonceModule {}
