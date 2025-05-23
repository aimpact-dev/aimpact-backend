import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { heliusEnvConfig } from 'src/shared/config';
import { HeliusWebhookEvent, HeliusWebhookEventSchema } from './data/helius-webhook.event';

@Injectable()
export class HeliusWebhookService {
  private readonly logger = new Logger(HeliusWebhookService.name);

  constructor(@Inject(heliusEnvConfig.KEY) private readonly heliusConfig: ConfigType<typeof heliusEnvConfig>) {}

  async validateWebhook(event: any): Promise<HeliusWebhookEvent> {
    try {
      await this.authenticateWebhook(event);
      this.logger.log('Helius webhook authenticated');

      const validated = HeliusWebhookEventSchema.parse({ body: event.body });
      this.logger.log(`Validated - ${JSON.stringify(validated)}`);

      return validated;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Invalid event');
    }
  }

  private async authenticateWebhook(event: any): Promise<void> {
    const authHeader = event.headers['authorization'];
    const verified = authHeader === this.heliusConfig.HELIUS_WEBHOOK_AUTH_HEADER;

    if (!verified) {
      throw new UnauthorizedException('Invalid webhook');
    }
  }
}
