import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, PublicKey, LAMPORTS_PER_SOL, AccountInfo, Context } from '@solana/web3.js';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
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
      (accountInfo: AccountInfo<Buffer>, context: Context) => {
        const currentLamports = accountInfo.lamports;
        const diff = currentLamports - this.lastLamports;
        if (diff > 0) {
          const solAmount = diff / 1e9;
        }
      },
      'confirmed',
    );
  }
}
