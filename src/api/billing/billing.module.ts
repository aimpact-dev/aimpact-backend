import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FundsReceipt, User])],
  controllers: [BillingController],
})
export class BillingModule {}
