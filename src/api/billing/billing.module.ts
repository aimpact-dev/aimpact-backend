import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { billingEnvConfig, cryptoEnvConfig } from 'src/shared/config';
import { HeliusSharedModule } from 'src/shared/modules/crypto/helius/helius-shared.module';
import { BillingService } from './billing.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([FundsReceipt, User]),
    ConfigModule.forFeature(billingEnvConfig),
    HeliusSharedModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
