import {
  DeployAppRequest,
  DeploymentLog,
  DeploymentStatus,
  Provider,
} from '../../../entities/deploy-app-request.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DeployAppResponse {
  @ApiProperty(
    { description: 'Unique identifier for the project', example: '123e4567-e89b-12d3-a456-426614174000' }
  )
  projectId: string;

  @ApiProperty(
    { description: 'Unique identifier for the deployment', example: '123e4567-e89b-12d3-a456-426614174001' }
  )
  deploymentId: string;

  @ApiProperty({
    description: 'Current status of the deployment',
    example: 'READY',
    enum: ['QUEUED', 'BUILDING', 'ERROR', 'INITIALIZING', 'READY', 'CANCELED'],
  })
  status: DeploymentStatus;

  @ApiProperty({
    description: 'Indicates if the app has been successfully deployed',
    example: true,
  })
  isDeployed: boolean;

  @ApiProperty({
    description: 'Message providing additional information about the deployment',
    example: 'Deployment completed successfully.',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Logs related to the deployment process',
    type: [Object],
    required: false,
  })
  logs?: Array<DeploymentLog>;

  @ApiProperty({
    description: 'Final URL of the deployed application',
    example: 'https://123e4567-e89b-12d3-a456-426614174001.vercel.app',
    required: false,
  })
  finalUrl?: string | null;

  @ApiProperty({
    description: 'Provider used for deployment',
    example: 'Vercel',
  })
  provider: Provider;

  @ApiProperty({
    description: 'Timestamp when the deployment request was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  public static fromEntity(deployAppRequest: DeployAppRequest): DeployAppResponse {
    return {
      projectId: deployAppRequest.projectId,
      deploymentId: deployAppRequest.deploymentId,
      status: deployAppRequest.status,
      isDeployed: deployAppRequest.isDeployed,
      message: deployAppRequest.message,
      logs: deployAppRequest.logs,
      finalUrl: deployAppRequest.finalUrl,
      provider: deployAppRequest.provider,
      createdAt: deployAppRequest.createdAt
    }
  }
}