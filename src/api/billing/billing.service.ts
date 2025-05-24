import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { billingEnvConfig, cryptoEnvConfig } from 'src/shared/config';
import { HeliusWebhookService } from 'src/shared/modules/crypto/helius/helius-webhook.service';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';

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

  async handleWebhook(event: any, res: Response): Promise<any> {
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

    return res.status(200).json({ message: 'OK' });
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

    await this.updateUserMessagesLeft(userId, amount);

    this.logger.log(`transaction ${txHash} processed: from ${sender} SOL ${amount}`);
  }

  private async updateUserMessagesLeft(userId: string, solAmountPaid: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const messagesPaid = Math.floor(solAmountPaid / this.billingConfig.PRICE_PER_MESSAGE_IN_SOL);
    user.messagesLeft += messagesPaid;

    await this.userRepository.save(user);

    this.logger.log(`User ${userId} paid ${solAmountPaid} SOL, added ${messagesPaid} messages`);
  }

  private async findByTransactionHash(transactionHash: string): Promise<FundsReceipt | null> {
    return this.receiptRepository.findOne({
      where: { transactionHash },
    });
  }
}
