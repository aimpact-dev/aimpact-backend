import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { ApiContext } from 'src/api/auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';

@Controller('deploy-app')
export class DeployAppController {
  constructor(private readonly deployAppService: DeployAppService) {}

  @Post()
  requestDeployApp(@ApiContext() user: User, @Body() dto: RequestDeployAppDto) {
    return this.deployAppService.requestDeployApp(user, dto);
  }

  @Get()
  getDeployApp(@ApiContext() user: User, @Body() dto: GetDeployAppDto) {
    return this.deployAppService.getDeployApp(user, dto);
  }
}
