import { S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import { awsEnvConfig } from '../../../config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(@Inject(awsEnvConfig.KEY) private readonly awsConfig: ConfigType<typeof awsEnvConfig>) {
    const awsRegion = awsConfig.AWS_REGION;
    const awsAccessKeyId = awsConfig.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = awsConfig.AWS_SECRET_ACCESS_KEY;
    const awsBucketName = awsConfig.AWS_BUCKET_NAME;
    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    } as any);
    this.bucketName = awsBucketName;
  }

  async uploadTextFile(fileName: string, fileContent: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileContent,
    });

    // @ts-ignore
    await this.s3Client.send(command);
  }

  async downloadObjectFromFile(fileName: string): Promise<object> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    // @ts-ignore
    const response = await this.s3Client.send(command);  // AWS kurwa messed up with their types
    // @ts-ignore
    if (!response.Body) {  // AWS kurwa messed up with their types
      throw new NotFoundException(`File ${fileName} not found`);
    }
    // @ts-ignore
    const fileContent = await response.Body.transformToString();  // AWS kurwa messed up with their types
    return JSON.parse(fileContent)
  }
}