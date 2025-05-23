import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { billingEnvConfig, cryptoEnvConfig } from 'src/shared/config';
import { HeliusWebhookService } from 'src/shared/modules/crypto/helius/helius-webhook.service';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @Inject(billingEnvConfig.KEY) private readonly billingConfig: ConfigType<typeof billingEnvConfig>,
    @InjectRepository(FundsReceipt)
    private readonly receiptRepository: Repository<FundsReceipt>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly heliusWebhookService: HeliusWebhookService,
  ) {}

  async handleWebhook(event: any): Promise<void> {
    this.logger.log(`Incoming event - ${JSON.stringify(event.body)}`);

    const validated = await this.heliusWebhookService.validateWebhook(event);

    for (const tx of validated.body) {
      if (
        !tx.slot ||
        !tx.timestamp ||
        !tx.signature ||
        !tx.fee ||
        !tx.feePayer ||
        !tx.nativeTransfers?.length ||
        tx.transactionError ||
        !['TRANSFER'].includes(tx.type)
      ) {
        continue;
      }

      const nativeTransfer = tx.nativeTransfers[0];
      const sender = nativeTransfer.fromUserAccount;
      const receiver = nativeTransfer.toUserAccount;

      if (receiver !== this.billingConfig.TRACK_WALLET) {
        continue;
      }

      const amount = nativeTransfer.amount / 1e9;
      const txHash = tx.signature;

      await this.processFundReceipt(txHash, sender, amount);
    }
  }

  async processFundReceipt(txHash: string, sender: string, amount: number) {
    const tx = await this.findByTransactionHash(txHash);
    if (tx) {
      this.logger.log(`transaction with signature ${txHash} already exist`);
      return;
    }

    const user = await this.userRepository.findOne({ where: { wallet: sender } });

    let userId: string;
    if (!user) {
      const newUser = this.userRepository.create({ wallet: sender });
      const savedUser = await this.userRepository.save(newUser);
      userId = savedUser.id;
    } else {
      userId = user.id;
    }

    const receipt = this.receiptRepository.create({
      userId,
      amount,
      transactionHash: txHash,
    });
    await this.receiptRepository.save(receipt);

    this.logger.log(`transaction ${txHash} processed: from ${sender} SOL ${amount}`);
  }

  private async findByTransactionHash(transactionHash: string): Promise<FundsReceipt | null> {
    return this.receiptRepository.findOne({
      where: { transactionHash },
    });
  }
}
