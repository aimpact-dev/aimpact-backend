import { Controller, Post, Request } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('payment-webhook')
  async handlePaymentWebhook(@Request() event: any): Promise<void> {
    await this.billingService.handleWebhook(event);
  }
}
