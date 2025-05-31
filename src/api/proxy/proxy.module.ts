import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ConfigModule } from '@nestjs/config';
import { cryptoEnvConfig } from 'src/shared/config';
import { ProxyService } from './proxy.service';

@Module({
  imports: [ConfigModule.forFeature(cryptoEnvConfig)],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
