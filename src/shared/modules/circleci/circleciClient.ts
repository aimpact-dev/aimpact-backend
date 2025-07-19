import { Inject, Injectable } from '@nestjs/common';
import CircleCI from 'circleci';
import { deploymentConfig } from '../../config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CircleCiClient {
  private readonly client;
  constructor(@Inject(deploymentConfig.KEY) private readonly deploymentEnvironment: ConfigType<typeof deploymentConfig>) {
    this.client = new CircleCI({auth: this.deploymentEnvironment.CIRCLECI_AUTH_TOKEN})
  }


}