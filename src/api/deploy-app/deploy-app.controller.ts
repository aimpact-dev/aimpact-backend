import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { ApiContext } from 'src/api/auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetDeployAppRequest } from './request/get-deploy-app.request';
import { DeployAppResponse } from './response/deploy-app.response';

@Controller('deploy-app')
@ApiBearerAuth()
export class DeployAppController {
  constructor(private readonly deployAppService: DeployAppService) {}

  @Post()
  @ApiResponse(
    {
      status: 201,
      description: 'Request to deploy app has been successfully created.',
      type: DeployAppResponse, // Assuming the response is a string, adjust as necessary
    },
  )
  requestDeployApp(@ApiContext() user: User, @Body() dto: RequestDeployAppDto) {
    return this.deployAppService.requestDeployApp(user, dto);
  }

  @Get()
  @ApiResponse(
    {
      status: 200,
      description: 'Successfully retrieved deploy app information.',
      type: DeployAppResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  getDeployApp(@ApiContext() user: User, @Query() requestData: GetDeployAppRequest) {
    return this.deployAppService.getDeployApp(user, requestData);
  }
}
