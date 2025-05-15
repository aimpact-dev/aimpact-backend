import { Body, Controller, Post } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { Public } from 'src/api/auth/public.decorator';

@Controller('deploy-app')
export class DeployAppController {
  constructor (private readonly deployAppService: DeployAppService) {}

  @Post()
  requestDeployApp(@Body() dto: ) {
    
  }
}
