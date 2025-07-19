import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { ApiContext } from 'src/api/auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetDeployAppRequest } from './request/get-deploy-app.request';
import { DeployAppResponse } from './response/deploy-app.response';
import { DeployToS3Dto } from './dto/deployToS3.dto';
import { S3DeploymentResponse } from './response/s3-deployment.response';
import { Public } from '../auth/decorator/public.decorator';
import { DeployToICPDto } from './dto/deployToICP.dto';

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

  @Post('s3-deployment')
  @ApiResponse(
    {
      status: 201,
      description: 'Request to deploy app to S3 has been successfully created.',
      type: S3DeploymentResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  upsertS3Deployment(@ApiContext() user: User, @Body() dto: DeployToS3Dto) {
    return this.deployAppService.upsertS3Deployment(dto.projectId, user.id, dto.snapshot);
  }

  @Public()
  @Get('s3-deployment')
  @ApiResponse(
    {
      status: 200,
      description: 'S3 deployment url retrieved successfully.',
      type: S3DeploymentResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  getS3Deployment(@Query('projectId') projectId: string) {
    return this.deployAppService.getS3DeploymentUrl(projectId);
  }

  @Post('icp-deployment')
  @ApiResponse(
    {
      status: 201,
      description: 'Request to deploy app to ICP has been successfully created.',
      type: DeployAppResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  upsertIcpDeployment(@ApiContext() user: User, @Body() dto: DeployToICPDto) {
    return this.deployAppService.upsertIcpDeployment(dto.projectId, user.id, dto.snapshot);
  }

  @Get('icp-deployment')
  @ApiResponse(
    {
      status: 200,
      description: 'ICP deployment url retrieved successfully.',
      type: DeployAppResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  getIcpDeployment(@ApiContext() user: User, @Query('projectId') projectId: string) {
    return this.deployAppService.getIcpDeployment(projectId, user.id);
  }


  @Post('icp-deployment/pipeline-webhook')
  @ApiResponse(
    {
      status: 200,
      description: 'ICP deployment url retrieved successfully.',
      type: DeployAppResponse, // Assuming the response is a DeployAppResponse object
    },
  )
  updateIcpDeploymentUrl(@Body() dto: {finalUrl: string, projectId: string}) {
    // return this.deployAppService.initICPDeploymentPipeline(dto.pipelineWebhookUrl, dto.projectS3Url);
  }
}
