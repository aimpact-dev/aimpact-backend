import { Controller, Post, Request, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Public } from '../auth/decorator/public.decorator';
import { Response } from 'express';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { MessagesLeftResponse } from './response/messages-left.response';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Public()
  @Post('payment-webhook')
  async handlePaymentWebhook(@Request() event: any, @Res() res: Response): Promise<any> {
    return this.billingService.handleWebhook(event, res);
  }

  @Post('decrement-messages-left')
  async decrementMessagesLeft(@ApiContext() user: User): Promise<MessagesLeftResponse> {
    return this.billingService.decrementMessagesLeft(user);
  }
}
