import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import { awsEnvConfig } from '../../../config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(@Inject(awsEnvConfig.KEY) private readonly awsConfig: ConfigType<typeof awsEnvConfig>) {
    this.s3Client = new S3Client({
      region: awsConfig.AWS_REGION,
      credentials: {
        accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsConfig.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = awsConfig.AWS_BUCKET_NAME;
  }

  async uploadTextFile(fileName: string, fileContent: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileContent,
    });

    await this.s3Client.send(command);
  }

  async downloadObjectFromFile(fileName: string): Promise<object> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    const response = await this.s3Client.send(command);
    if (!response.Body) {
      throw new NotFoundException(`File ${fileName} not found`);
    }
    const fileContent = await response.Body.transformToString();

    return JSON.parse(fileContent);
  }
}
