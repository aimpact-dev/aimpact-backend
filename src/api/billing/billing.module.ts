import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FundsReceipt])],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}
