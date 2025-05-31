import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { billingEnvConfig, cryptoEnvConfig, referralsEnvConfig } from 'src/shared/config';
import { HeliusWebhookService } from 'src/shared/modules/crypto/helius/helius-webhook.service';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { MessagesLeftResponse } from './response/messages-left.response';
import { BuyForRewardsDto } from './dto/buyForRewards.dto';
import { lamportsToSol, solToLamports } from 'src/api/utils/solanaConvert';
import { RewardsWithdrawalReceipt } from '../../entities/rewards-withdrawal-receipt.entity';
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { WithdrawalReceiptResponse } from './response/withdrawal-reciept.response';
import { FundReceiptResponse } from './response/fund-receipt.response';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @Inject(billingEnvConfig.KEY) private readonly billingConfig: ConfigType<typeof billingEnvConfig>,
    @Inject(referralsEnvConfig.KEY) private readonly referralsConfig: ConfigType<typeof referralsEnvConfig>,
    @Inject(cryptoEnvConfig.KEY) private readonly cryptoConfig: ConfigType<typeof cryptoEnvConfig>,
    @InjectRepository(FundsReceipt)
    private readonly receiptRepository: Repository<FundsReceipt>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RewardsWithdrawalReceipt)
    private readonly rewardsReceiptRepository: Repository<RewardsWithdrawalReceipt>,
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

  private async creditReferralReward(user: User, amount: number) {
    const referrer = await this.userRepository.findOne({ where: { id: user.referrerId } });
    if (!referrer) {
      return;
    }
    const referralReward = amount * this.referralsConfig.REFERRER_FEE * Math.pow(10, this.cryptoConfig.DECIMALS);
    referrer.referralsRewards = parseFloat(referrer.referralsRewards.toString()) + referralReward;
    this.logger.log(`Credited referral reward of ${referralReward} lamports to referrer ${referrer.id}`);
    await this.userRepository.save(referrer);
  }

  async processFundReceipt(txHash: string, sender: string, amount: number) {
    const tx = await this.findByTransactionHash(txHash);
    if (tx) {
      this.logger.log(`transaction with signature ${txHash} already exist`);
      return;
    }

    let user = await this.userRepository.findOne({ where: { wallet: sender } });

    if (!user) {
      const newUser = this.userRepository.create({ wallet: sender });
      user = await this.userRepository.save(newUser);
    }
    const userId = user.id;

    const receipt = this.receiptRepository.create({
      userId,
      amount,
      transactionHash: txHash,
    });
    await this.creditReferralReward(user, amount);
    await this.updateUserMessagesLeft(userId, amount);
    await this.receiptRepository.save(receipt);

    this.logger.log(`transaction ${txHash} processed: from ${sender} SOL ${amount}`);
  }

  async decrementMessagesLeft(user: User): Promise<MessagesLeftResponse> {
    user.messagesLeft -= 1;
    await this.userRepository.save(user);

    return { messagesLeft: user.messagesLeft };
  }

  private async updateUserMessagesLeft(userId: string, solAmountPaid: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const discount = user.discountPercent / 100;
    const pricePerMessageWithDiscount = this.billingConfig.PRICE_PER_MESSAGE_IN_SOL - (this.billingConfig.PRICE_PER_MESSAGE_IN_SOL * discount);
    if (pricePerMessageWithDiscount == 0) {
      throw new InternalServerErrorException("Price per message with discount cannot be zero. Seems like user has 100% discount.");
    }
    const messagesPaid = Math.floor(solAmountPaid / pricePerMessageWithDiscount);
    user.messagesLeft += messagesPaid;
    user.discountPercent = 0;  // Reset discount after payment

    await this.userRepository.save(user);

    this.logger.log(`User ${userId} paid ${solAmountPaid} SOL, added ${messagesPaid} messages`);
  }

  private async findByTransactionHash(transactionHash: string): Promise<FundsReceipt | null> {
    return this.receiptRepository.findOne({
      where: { transactionHash },
    });
  }

  async buyMessagesForRewards(user: User, buyInfo: BuyForRewardsDto): Promise<MessagesLeftResponse> {
    const lamportsAmount = solToLamports(buyInfo.amount);
    if (lamportsAmount > user.referralsRewards) {
      throw new BadRequestException('Not enough rewards to buy messages');
    }
    const messagesPaid = Math.floor(buyInfo.amount / this.billingConfig.PRICE_PER_MESSAGE_IN_SOL * this.referralsConfig.MESSAGES_FOR_REWARDS_MULTIPLIER);
    if (messagesPaid > 0) {
      user.messagesLeft += messagesPaid;
      user.referralsRewards -= lamportsAmount;
      await this.userRepository.save(user);
    }
    else {
      throw new BadRequestException('Not enough rewards to buy messages');
    }
    return {
      messagesLeft: user.messagesLeft
    }
  }

  async withdrawRewards(user: User): Promise<WithdrawalReceiptResponse> {
    if (user.referralsRewards <= 0) {
      throw new BadRequestException('No rewards to withdraw');
    }

    const privateKey = bs58.decode(this.cryptoConfig.WALLET_PRIVATE_KEY);

    const connection = new Connection(this.cryptoConfig.HTTP_RPC_URL, 'confirmed');
    const fromAccount = Keypair.fromSecretKey(privateKey)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromAccount.publicKey,
        toPubkey: new PublicKey(user.wallet),
        lamports: user.referralsRewards  // Already in lamports
      }),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromAccount],
    );
    this.logger.log(`Transaction sent with signature: ${signature}`);
    // Create a receipt for the withdrawal
    const receipt = this.rewardsReceiptRepository.create({
      userId: user.id,
      amount: user.referralsRewards,
      transactionHash: signature,
    });

    // Reset user's rewards after withdrawal
    user.referralsRewards = 0;
    await this.rewardsReceiptRepository.save(receipt);
    await this.userRepository.save(user);

    return {
      id: receipt.id,
      amount: lamportsToSol(receipt.amount),
      transactionHash: receipt.transactionHash,
      createdAt: receipt.createdAt,
    };
  }

  async getRewardsWithdrawalReceipts(user: User): Promise<WithdrawalReceiptResponse[]> {
    return (await this.rewardsReceiptRepository.find({ where: { userId: user.id } })).map(receipt => {
      receipt.amount = lamportsToSol(receipt.amount);
      return {
        id: receipt.id,
        amount: receipt.amount,
        transactionHash: receipt.transactionHash,
        createdAt: receipt.createdAt,
      };
    });
  }

  async getFundsReceipts(user: User): Promise<FundReceiptResponse[]> {
    return (await this.receiptRepository.find({ where: { userId: user.id } })).map(receipt => {
      return {
        id: receipt.id,
        amount: parseFloat(receipt.amount as unknown as string),
        transactionHash: receipt.transactionHash,
        createdAt: receipt.createdAt,
      };
    });
  }
}
