import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Public } from '../auth/decorator/public.decorator';
import { Response } from 'express';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { MessagesLeftResponse } from './response/messages-left.response';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BuyForRewardsDto } from './dto/buyForRewards.dto';
import { RewardsWithdrawalReceipt } from '../../entities/rewards-withdrawal-receipt.entity';
import { WithdrawalReceiptResponse } from './response/withdrawal-reciept.response';
import { FundReceiptResponse } from './response/fund-receipt.response';
import { PendingMessagesResponse } from './response/pending-messages.response';


// type WithdrawalReceiptResponse = Omit<RewardsWithdrawalReceipt, 'user' | 'userId'>;

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

  @Post('decrement-pending-messages')
  @ApiBearerAuth()
  async decrementPendingMessages(@ApiContext() user: User): Promise<PendingMessagesResponse> {
    return this.billingService.decrementPendingMessages(user);
  }

  @Post('increment-pending-messages')
  @ApiBearerAuth()
  async incrementPendingMessages(@ApiContext() user: User): Promise<PendingMessagesResponse> {
    return this.billingService.incrementPendingMessages(user);
  }

  @Post('buy-for-rewards')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buy messages using rewards',
    description: 'This endpoint allows users to buy messages using their referral rewards. Always 10 * 2 messages are withdrawn.',
  })
  async buyMessagesForRewards(@ApiContext() user: User): Promise<MessagesLeftResponse> {
    return this.billingService.buyMessagesForRewards(user);
  }

  @Post('withdraw-rewards')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Withdraw rewards",
    type: WithdrawalReceiptResponse,
  })
  async withdrawRewards(@ApiContext() user: User): Promise<WithdrawalReceiptResponse> {
    return this.billingService.withdrawRewards(user);
  }

  @Get('rewards-withdrawal-receipts')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get rewards withdrawal receipts',
    description: 'This endpoint retrieves all rewards withdrawal receipts for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of rewards withdrawal receipts',
    type: [WithdrawalReceiptResponse],
  })
  async getRewardsWithdrawalReceipts(@ApiContext() user: User): Promise<WithdrawalReceiptResponse[]> {
    return await this.billingService.getRewardsWithdrawalReceipts(user);
  }

  @Get('funds-receipts')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get funds receipts',
    description: 'This endpoint retrieves all funds receipts for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of funds receipts',
    type: [FundReceiptResponse],
  })
  async getFundsReceipts(@ApiContext() user: User): Promise<FundReceiptResponse[]> {
    return await this.billingService.getFundsReceipts(user);
  }
}
