import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  AccountInfo,
  Context,
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillingService implements OnModuleInit {
  private readonly logger = new Logger(BillingService.name);
  private lastLamports; // SOL balance
  private connection: Connection;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FundsReceipt)
    private readonly receiptRepository: Repository<FundsReceipt>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const wss_rpc = configService.get<string>('WSS_RPC_URL');
    const http_rpc = configService.get<string>('HTTP_RPC_URL');
    if (!wss_rpc) throw new Error('WSS_RPC_URL not set up');
    if (!http_rpc) throw new Error('HTTP_RPC_URL not set up');
    this.connection = new Connection(http_rpc, { wsEndpoint: wss_rpc });
  }

  async onModuleInit() {
    const walletToTrack = this.configService.get<string>('TRACK_WALLET');
    if (!walletToTrack) throw new Error('TRACK_WALLET not set up');
    const account = new PublicKey(walletToTrack);
    this.lastLamports = await this.connection.getBalance(account, 'confirmed');
    const subscriptionId = await this.connection.onAccountChange(
      account,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        const currentLamports = accountInfo.lamports;
        const diff = currentLamports - this.lastLamports;
        if (diff > 0) {
          const solAmount = diff / 1e9;
          // 1. Get the latest transaction signature for this address
          const signatures = await this.connection.getSignaturesForAddress(account, {
            limit: 5,
          });

          for (const sigInfo of signatures) {
            try {
              const tx = await this.connection.getParsedTransaction(sigInfo.signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 1,
              });

              if (!tx || !tx.meta || tx.meta.err) continue; // Skip failed txs

              const transferIx = tx.transaction.message.instructions.find(
                (ix): ix is ParsedInstruction =>
                  'parsed' in ix &&
                  ix.program === 'system' &&
                  ix.parsed.type === 'transfer' &&
                  ix.parsed.info.destination === walletToTrack,
              );

              if (!transferIx) continue;
              const sender = transferIx.parsed.info.source;
              const amount = transferIx.parsed.info.lamports / 1e9;
              // Double-check amount matches `diff` to avoid false positives
              if (Math.abs(amount - solAmount) > 0.000001) continue;
              const timestamp = tx.blockTime ? new Date(tx.blockTime! * 1000) : new Date();
              await this.processFundReceipt(sigInfo.signature, sender, amount, timestamp);
            } catch (error) {
              this.logger.error('getParsedTransaction error:', error);
              break;
            }
            await sleep(100); // to awoid rate limit, just in case
          }
        }
      },
      'confirmed',
    );
  }

  async processFundReceipt(txHash: string, sender: string, amount: number, timestamp: Date) {
    const tx = await this.findByTransactionHash(txHash);
    if (tx) {
      this.logger.log(`transaction with signature ${txHash} already exist`);
      return;
    }
    const user = await this.userRepository.findOne({ where: { wallet: sender } });
    let userId: string;
    if (!user) {
      const newUser = this.userRepository.create({
        wallet: sender,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      const savedUser = await this.userRepository.save(newUser);
      userId = savedUser.id;
    } else {
      userId = user.id;
    }
    const receipt = this.receiptRepository.create({
      userId, // If still needed
      amount,
      timestamp: new Date(),
      transactionHash: txHash,
    });
    await this.receiptRepository.save(receipt);
    this.logger.log(`transaction ${txHash} processed: from ${sender} SOL ${amount}`);
  }

  async findByTransactionHash(transactionHash: string): Promise<FundsReceipt | null> {
    return this.receiptRepository.findOne({
      where: { transactionHash },
    });
  }
}

function isParsedInstruction(ix: ParsedInstruction | PartiallyDecodedInstruction): ix is ParsedInstruction {
  return 'parsed' in ix;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
