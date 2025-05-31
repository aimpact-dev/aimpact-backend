import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { ApiContext } from 'src/api/auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('deploy-app')
@ApiBearerAuth()
export class DeployAppController {
  constructor(private readonly deployAppService: DeployAppService) {}

  @Post()
  requestDeployApp(@ApiContext() user: User, @Body() dto: RequestDeployAppDto) {
    return this.deployAppService.requestDeployApp(user, dto);
  }

  @Get()
  getDeployApp(@ApiContext() user: User, @Query() dto: GetDeployAppDto) {
    return this.deployAppService.getDeployApp(user, dto);
  }
}
