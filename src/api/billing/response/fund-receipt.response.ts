import { OmitType } from '@nestjs/swagger';
import { FundsReceipt } from '../../../entities/funds-receipt.entity';

export class FundReceiptResponse extends OmitType(FundsReceipt, ['user', 'userId', 'updatedAt'] as const) {}
