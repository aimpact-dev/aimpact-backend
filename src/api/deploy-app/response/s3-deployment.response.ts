import { ApiProperty } from '@nestjs/swagger';

export class S3DeploymentResponse {
  @ApiProperty({
    description: 'Deployment url',
    example: 'https://123e4567-e89b-12d3-a456-426614174000.deployment.aimpact.dev',
  })
  url: string;
}
