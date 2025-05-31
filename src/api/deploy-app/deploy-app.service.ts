import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { Project } from 'src/entities/project.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { deserializeSnapshot, FileMap } from './webcontainerSnapshotDeserializer';
import { S3Service } from '../../shared/modules/aws/s3/s3.service';

@Injectable()
export class DeployAppService {
  private vercelClient: any;
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Service,
    @InjectRepository(DeployAppRequest)
    private readonly deployAppRequestRepository: Repository<DeployAppRequest>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    const vercelToken = this.configService.get<string>('VERCEL_API_KEY');
    if (!vercelToken) throw new Error('Vercel API key is not set');
    // Use an async IIFE to allow await in constructor
    (async () => {
      const { Vercel } = await import('@vercel/sdk');
      this.vercelClient = new Vercel({ bearerToken: vercelToken });
    })();
  }
  async requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<DeployAppRequest> {
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
    const deployRequest = await this.deployAppRequestRepository.create({
      projectId: project.id,
      deploymentId: createResponse.id,
      status: createResponse.status,
      isDeployed: false,
      finalUrl: createResponse.url,
    });
    await this.deployAppRequestRepository.save(deployRequest);
    return deployRequest;
  }

  async getDeployApp(user: User, dto: GetDeployAppDto): Promise<DeployAppRequest> {
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
}
