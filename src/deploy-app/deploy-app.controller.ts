import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { JwtAuthGuard } from 'src/api/auth/jwt-auth.guard';

@Controller('deploy-app')
export class DeployAppController {
  constructor (private readonly deployAppService: DeployAppService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  requestDeployApp(@Body() dto: RequestDeployAppDto, @Request() req) {
    return this.deployAppService.requestDeployApp(req.user, dto);
  }
}
