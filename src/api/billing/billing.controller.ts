import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Public } from '../auth/decorator/public.decorator';
import { Response } from 'express';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { MessagesLeftResponse } from './response/messages-left.response';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BuyForRewardsDto } from './dto/buyForRewards.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Public()
  @Post('payment-webhook')
  @ApiOperation({
    summary: 'Payment webhook to be used by Helius',
    description:
      'Helius will call this endpoint when a payment is made. This endpoint will then update the user balance. Authentication is specific here, header: "Authorization: <helius-webhook-auth-token-from-env>"',
  })
  async handlePaymentWebhook(@Request() event: any, @Res() res: Response): Promise<any> {
    return this.billingService.handleWebhook(event, res);
  }

  @Post('decrement-messages-left')
  @ApiBearerAuth()
  async decrementMessagesLeft(@ApiContext() user: User): Promise<MessagesLeftResponse> {
    return this.billingService.decrementMessagesLeft(user);
  }

  @Post('buy-for-rewards')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buy messages using rewards',
    description: 'This endpoint allows users to buy messages using their referral rewards.',
  })
  async buyMessagesForRewards(@ApiContext() user: User, @Body() buyInfo: BuyForRewardsDto): Promise<MessagesLeftResponse> {
    return this.billingService.buyMessagesForRewards(user, buyInfo);
  }
}
