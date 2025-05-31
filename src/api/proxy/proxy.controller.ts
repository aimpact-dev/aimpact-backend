import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendTxRequest } from './request/send-tx.request';
import { ProxyService } from './proxy.service';
import { RecentBlockhashResponse } from './response/recent-blockhash.response';
import { SendTxResponse } from './response/send-tx.response';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('recent-blockhash')
  async getRecentBlockhash(): Promise<RecentBlockhashResponse> {
    return this.proxyService.getRecentBlockhash();
  }

  @Post('send-tx')
  async sendTx(@Body() body: SendTxRequest): Promise<SendTxResponse> {
    return this.proxyService.sendTx(body.serializedTx);
  }
}
