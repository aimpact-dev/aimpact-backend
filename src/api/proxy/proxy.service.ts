import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Connection, Transaction } from '@solana/web3.js';
import { cryptoEnvConfig } from 'src/shared/config';
import { RecentBlockhashResponse } from './response/recent-blockhash.response';
import { SendTxResponse } from './response/send-tx.response';

@Injectable()
export class ProxyService {
  private connection: Connection;

  constructor(
    @Inject(cryptoEnvConfig.KEY)
    private readonly config: ConfigType<typeof cryptoEnvConfig>,
  ) {
    this.connection = new Connection(this.config.HTTP_RPC_URL);
  }

  async getRecentBlockhash(): Promise<RecentBlockhashResponse> {
    const response = await this.connection.getLatestBlockhash();

    return {
      blockhash: response.blockhash,
      lastValidBlockHeight: response.lastValidBlockHeight,
    };
  }

  async sendTx(serializedTx: string): Promise<SendTxResponse> {
    const tx = Transaction.from(Buffer.from(serializedTx, 'base64'));
    const txHash = await this.connection.sendRawTransaction(tx.serialize());

    await this.connection.confirmTransaction(
      {
        signature: txHash,
        ...(await this.connection.getLatestBlockhash()),
      },
      'confirmed',
    );

    return {
      txHash,
    };
  }
}
