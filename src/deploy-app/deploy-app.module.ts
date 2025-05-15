import { Module } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { DeployAppController } from './deploy-app.controller';

@Module({
  providers: [DeployAppService],
  controllers: [DeployAppController]
})
export class DeployAppModule {}
