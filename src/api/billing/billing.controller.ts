import { Controller, Post, Request } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Public } from '../auth/decorator/public.decorator';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Public()
  @Post('payment-webhook')
  async handlePaymentWebhook(@Request() event: any): Promise<void> {
    await this.billingService.handleWebhook(event);
  }
}
