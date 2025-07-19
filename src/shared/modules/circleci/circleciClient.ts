import { Inject, Injectable } from '@nestjs/common';
import { deploymentConfig } from '../../config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CircleCiClient {
  constructor(@Inject(deploymentConfig.KEY) private readonly deploymentEnvironment: ConfigType<typeof deploymentConfig>) {
  }

  /**
   * Initializes the ICP deployment pipeline and returns the pipeline id
   * @param projectS3Url S3 URL of the project build (e.g. s3://bucket/key/)
   */
  async initICPDeploymentPipeline(projectS3Url: string): Promise<string> {
    const response = await fetch(this.deploymentEnvironment.DEPLOYMENT_PIPELINE_TRIGGER_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Circle-Token': this.deploymentEnvironment.CIRCLECI_AUTH_TOKEN,
      },
      body: JSON.stringify({
        definition_id: '9e3f55c7-0729-40ac-9d7d-11e5e9093542',
        parameters: {
          project_s3_url: projectS3Url,
          backend_url: this.deploymentEnvironment.ICP_DEPLOYMENT_WEBHOOK,
        },
        config: { branch: 'circleci-project-setup-icp' },
        checkout: { branch: 'circleci-project-setup-icp' },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize ICP deployment pipeline');
    }

    const data = (await response.json()) as { id: string };
    return data.id;
  }

  /**
   * Gets the status of an ICP deployment pipeline
   * @param pipelineId Pipeline/workflow id returned from initICPDeploymentPipeline
   */
  async getICPDeploymentStatus(pipelineId: string): Promise<any> {
    const response = await fetch(`https://circleci.com/api/v2/workflow/${pipelineId}/job`, {
      headers: {
        'Circle-Token': this.deploymentEnvironment.CIRCLECI_AUTH_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get ICP deployment status');
    }

    const data = await response.json();
    return data;
  }
}