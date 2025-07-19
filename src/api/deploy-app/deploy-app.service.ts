import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { ConfigService, ConfigType } from '@nestjs/config';
import { deserializeDistSnapshot, deserializeSnapshot, FileMap } from './webcontainerSnapshotDeserializer';
import { S3Service } from '../../shared/modules/aws/s3/s3.service';
import { GetDeployAppRequest } from './request/get-deploy-app.request';
import { DeployAppResponse } from './response/deploy-app.response';
import { S3Deployment } from '../../entities/deploy-s3.entity';
import { deploymentConfig } from '../../shared/config';
import { S3DeploymentResponse } from './response/s3-deployment.response';
import { initICPDeploymentPipeline } from './icpDeploymentPipeline';

@Injectable()
export class DeployAppService {
  private vercelClient: any;
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Service,
    @Inject(deploymentConfig.KEY) private readonly deploymentEnvironment: ConfigType<typeof deploymentConfig>,
    @InjectRepository(DeployAppRequest)
    private readonly deployAppRequestRepository: Repository<DeployAppRequest>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(S3Deployment)
    private readonly s3DeploymentRepository: Repository<S3Deployment>,
  ) {
    const vercelToken = this.configService.get<string>('VERCEL_API_KEY');
    if (!vercelToken) throw new Error('Vercel API key is not set');
    // Use an async IIFE to allow await in constructor
    (async () => {
      const { Vercel } = await import('@vercel/sdk');
      this.vercelClient = new Vercel({ bearerToken: vercelToken });
    })();
  }
  async requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<DeployAppResponse> {
    // Deploy app to vercel
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
      relations: ['projectSnapshot', 'deployAppRequest'],
    });
    if (!project) throw new NotFoundException('Project not found');

    if (!project.projectSnapshot) throw new NotFoundException('Project snapshot not found');
    if (!project.projectSnapshot.filesPath) throw new NotFoundException('Project files not found');
    // download the files from s3
    const filesPath = project.projectSnapshot.filesPath;
    const files = await this.s3Client.downloadObjectFromFile(filesPath);
    if (!files) throw new NotFoundException('Project files not found');

    const createResponse = await this.vercelClient.deployments.createDeployment({
      requestBody: {
        name: project.id, //The project id used in the deployment URL
        target: 'production',
        files: deserializeSnapshot(files as FileMap),
        projectSettings: {
          buildCommand: 'npm run build',
          installCommand: 'npm i',
          devCommand: 'npm run dev',
          outputDirectory: 'dist',
          framework: 'vite',
        },
      },
    });

    if (project.deployAppRequest) {
      project.deployAppRequest.deploymentId = createResponse.id;
      project.deployAppRequest.status = createResponse.status;
      project.deployAppRequest.isDeployed = false;
      project.deployAppRequest.message = undefined;
      project.deployAppRequest.finalUrl = createResponse.url;

      await this.deployAppRequestRepository.save(project.deployAppRequest);

      return project.deployAppRequest;
    }
    const deployRequest = this.deployAppRequestRepository.create({
      projectId: project.id,
      deploymentId: createResponse.id,
      status: createResponse.status,
      isDeployed: false,
      finalUrl: createResponse.url,
      provider: 'Vercel',
    });
    await this.deployAppRequestRepository.save(deployRequest);
    return deployRequest;
  }

  async getDeployApp(user: User, dto: GetDeployAppRequest): Promise<DeployAppResponse> {
    const deployAppReq = await this.deployAppRequestRepository.findOne({
      where: { projectId: dto.projectId },
    });
    if (!deployAppReq) throw new NotFoundException('Deploy Request not found');
    const deploymentId = deployAppReq.deploymentId;
    const deploymentStatusResponse = await this.vercelClient.deployments.getDeployment({
      idOrUrl: deploymentId,
    });

    const deploymentStatus = deploymentStatusResponse.status;
    const deploymentURL = deploymentStatusResponse.url;

    const deployAppReqToSave = {
      ...deployAppReq,
      status: deploymentStatus,
      finalUrl: deploymentURL,
    };
    const buildFinished = deploymentStatus === 'READY' || deploymentStatus === 'ERROR';
    if (deploymentStatus === 'READY') {
      deployAppReqToSave.isDeployed = true;
    }
    if (buildFinished) {
      try {
        // Get build logs for more detailed error information
        const buildLogsResponse = (await this.vercelClient.deployments.getDeploymentEvents({
          idOrUrl: deploymentId,
          direction: 'forward'
        })) as Array<any>;

        // Add basic error message
        if (deploymentStatusResponse.errorMessage) {
          deployAppReqToSave.message = deploymentStatusResponse.errorMessage || 'Unknown error'
        }

        // Add build error logs
        deployAppReqToSave.logs = buildLogsResponse.map((log: any) => ({
          message: log.text,
          timestamp: log.created,
          type: log.type,
          level: log.level || null,
        }));

      } catch (logError) {
        console.error('Failed to retrieve deployment logs:', logError);
        deployAppReqToSave.message = deploymentStatusResponse.errorMessage || 'Unknown error - logs unavailable';
      }
    }
    await this.deployAppRequestRepository.save(deployAppReqToSave);

    return deployAppReqToSave;
  }

  async upsertS3Deployment(
    projectId: string,
    userId: string,
    snapshot: object,
  ): Promise<S3DeploymentResponse> {
    const project = await this.projectRepository.findOne({where: {id: projectId}})
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('You are not allowed to deploy this project');
    }

    const files = deserializeDistSnapshot(snapshot as FileMap);
    await this.s3Client.uploadProjectBuild(projectId, files.map((file) => ({
      fileName: file.file, content: file.data
    })));
    const deploymentUrl = `https://${projectId}${this.deploymentEnvironment.DEPLOYMENT_DOMAIN_POSTFIX}`;

    const existingS3Deployment = await this.s3DeploymentRepository.findOne({
      where: {projectId: projectId}
    });
    if (existingS3Deployment) {
      existingS3Deployment.url = deploymentUrl;
      await this.s3DeploymentRepository.save(existingS3Deployment);
    } else {
      const s3Deployment = this.s3DeploymentRepository.create(
        {
          projectId: projectId,
          url: deploymentUrl
        }
      );
      await this.s3DeploymentRepository.save(s3Deployment);
    }
    return {
      url: deploymentUrl
    };
  }

  async getS3DeploymentUrl(projectId: string) {
    if (!projectId) {
      throw new NotFoundException("Project ID is required");
    }
    const s3Deployment = await this.s3DeploymentRepository.findOne(
      { where: { projectId: projectId }}
    );
    if (!s3Deployment) {
      throw new NotFoundException("Project not found or is not deployed yet");
    }
    return {
      url: s3Deployment.url
    };
  }

  async upsertIcpDeployment(projectId: string, userId: string, snapshot: object): Promise<DeployAppResponse> {
    const project = await this.projectRepository.findOne({where: {id: projectId}})
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('You are not allowed to deploy this project');
    }

    const files = deserializeDistSnapshot(snapshot as FileMap);
    await this.s3Client.uploadProjectBuild(projectId, files.map((file) => ({
      fileName: file.file, content: file.data
    })));

    const pipelineId = await initICPDeploymentPipeline(
      this.deploymentEnvironment.DEPLOYMENT_PIPELINE_TRIGGER_WEBHOOK,
      `s3://${this.s3Client.deploymentsBucketName}/${projectId}/`,
    )

    const insertResponse = await this.deployAppRequestRepository.upsert({
      projectId: project.id,
      deploymentId: pipelineId,
      status: 'INITIALIZING',
      isDeployed: false,
      finalUrl: null,
      provider: 'ICP',
    }, {
      conflictPaths: ['projectId'],
    });
    return {
      projectId: project.id,
      deploymentId: pipelineId,
      status: 'INITIALIZING',
      isDeployed: false,
      finalUrl: null,
      provider: insertResponse.identifiers[0].provider,
      createdAt: insertResponse.identifiers[0].createdAt,
    };
  }

  async getIcpDeployment(projectId: string, userId: string) {
    if (!projectId) {
      throw new NotFoundException("Project ID is required");
    }
    const project = await this.projectRepository.findOne({where: {id: projectId}})
    if (!project) {
      throw new NotFoundException("Project not found or is not deployed yet");
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('You are not allowed to deploy this project');
    }

    const deployAppReq = await this.deployAppRequestRepository.findOne({where: {projectId: projectId}})
    if (!deployAppReq) {
      throw new NotFoundException("Project not found or is not deployed yet");
    }

    if (deployAppReq.provider !== 'ICP') {
      throw new ForbiddenException('This method if for ICP deployments only');
    }

    return DeployAppResponse.fromEntity(deployAppReq);
  }
}
