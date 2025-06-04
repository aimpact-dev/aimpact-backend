import { Global, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { sentryEnvConfig, baseEnvConfig } from 'src/shared/config';
import * as Sentry from '@sentry/node';

@Global()
@Module({
  imports: [ConfigModule.forFeature(sentryEnvConfig)],
})
export class LoggerSharedModule implements OnModuleInit {
  constructor(
    @Inject(sentryEnvConfig.KEY) private readonly sconfig: ConfigType<typeof sentryEnvConfig>,
    @Inject(baseEnvConfig.KEY) private readonly baseConfig: ConfigType<typeof baseEnvConfig>,
  ) {}

  private readonly logger = new Logger(LoggerSharedModule.name);

  onModuleInit() {
    this.initSentry();
  }

  private initSentry() {
    this.logger.log('=======================================');
    this.logger.log(`   Sentry initialized. Status: ${this.sconfig.SENTRY_ENABLED}`);
    this.logger.log('=======================================');
    Sentry.init({
      dsn: this.sconfig.SENTRY_DSN,
      enabled: this.sconfig.SENTRY_ENABLED,
      environment: this.baseConfig.NODE_ENV,
      sampleRate: this.sconfig.SENTRY_SAMPLE_RATE,
      skipOpenTelemetrySetup: true,
      tracesSampleRate: 0.2,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 0.2,
      // Setting this option to true will send default PII data to Sentry.
      // For example, automatic IP address collection on events
      sendDefaultPii: true,
    });
  }
}
