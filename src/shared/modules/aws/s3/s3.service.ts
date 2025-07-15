import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import { awsEnvConfig } from '../../../config';
import { ObjectCannedACL } from '@aws-sdk/client-s3/dist-types/models/models_0';
import mime from 'mime-types';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly deploymentsBucketName: string;

  constructor(@Inject(awsEnvConfig.KEY) private readonly awsConfig: ConfigType<typeof awsEnvConfig>) {
    this.s3Client = new S3Client({
      region: awsConfig.AWS_REGION,
      credentials: {
        accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsConfig.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = awsConfig.AWS_BUCKET_NAME;
    this.deploymentsBucketName = awsConfig.AWS_DEPLOYMENTS_BUCKET_NAME || this.bucketName;
  }

  async uploadTextFile(
    fileName: string,
    fileContent: string,
    bucketName?: string,
    acl?: ObjectCannedACL,
  ): Promise<void> {
    const uploadBucketName = bucketName || this.bucketName;
    // Define content type based on file extension
    if (!fileName || !fileContent) {
      throw new Error('File name and content must be provided');
    }

    const contentType = mime.lookup(fileName);
    console.log(contentType);
    const command = new PutObjectCommand({
      Bucket: uploadBucketName,
      Key: fileName,
      Body: fileContent,
      ACL: acl,
      ContentType: contentType,
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

  async uploadProjectBuild(projectId: string, files: { fileName: string; content: string }[]): Promise<void> {
    const uploadPromises = files.map((file) => {
      const fullPath = `${projectId}/${file.fileName}`;
      return this.uploadTextFile(fullPath, file.content, this.deploymentsBucketName, 'public-read');
    });

    await Promise.all(uploadPromises);
  }
}
