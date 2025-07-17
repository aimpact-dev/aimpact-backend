import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import { awsEnvConfig } from '../../../config';
import { ObjectCannedACL } from '@aws-sdk/client-s3/dist-types/models/models_0';
import mime from 'mime-types';
import {
  StreamingBlobPayloadInputTypes
} from '@smithy/types/dist-types/streaming-payload/streaming-blob-payload-input-types';

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

  async uploadFile(fileName: string, fileContent: StreamingBlobPayloadInputTypes, bucketName?: string, acl?: ObjectCannedACL | undefined): Promise<void> {
    const uploadBucketName = bucketName || this.bucketName;
    if (!fileName || !fileContent) {
      throw new Error('File name and content must be provided');
    }

    // Define content type based on file extension
    const contentType = mime.lookup(fileName);
    console.log('Content type for', fileName, contentType);
    console.log(uploadBucketName);
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

  async uploadProjectBuild(projectId: string, files: {fileName: string, content: string, isBinary: boolean}[]): Promise<void> {
    const uploadPromises = files.map((file) => {
      const fullPath = `${projectId}/${file.fileName}`;
      if (file.fileName.endsWith('.png') || file.fileName.endsWith('.jpg') || file.fileName.endsWith('.jpeg')) {
        return this.uploadFile(fullPath, Buffer.from(file.content, 'base64'), this.bucketName, 'public-read');
      }
      return this.uploadFile(fullPath, file.content, this.deploymentsBucketName, 'public-read');
    });

    await Promise.all(uploadPromises);
  }
}
