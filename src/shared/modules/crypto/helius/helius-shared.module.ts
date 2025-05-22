import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { heliusEnvConfig } from 'src/shared/config';
import { HeliusWebhookService } from './helius-webhook.service';
@Module({
  imports: [ConfigModule.forFeature(heliusEnvConfig)],
  providers: [HeliusWebhookService],
  exports: [HeliusWebhookService],
})
export class HeliusSharedModule {}
