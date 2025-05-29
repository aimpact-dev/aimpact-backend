import { OmitType } from '@nestjs/swagger';
import { RewardsWithdrawalReceipt } from '../../../entities/rewards-withdrawal-receipt.entity';

export class WithdrawalReceiptResponse extends OmitType(RewardsWithdrawalReceipt, ['user', 'userId', 'updatedAt'] as const) {}
