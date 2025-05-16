import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { Vercel } from '@vercel/sdk';
import { Project } from 'src/entities/project.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { deserializeSnapshot } from './webcontainerSnapshotDeserializer';

@Injectable()
export class DeployAppService {
  private vercelClient: Vercel;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(DeployAppRequest)
    private readonly deployAppRequestRepository: Repository<DeployAppRequest>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    const vercelToken = this.configService.get<string>('VERCEL_API_KEY');
    if (!vercelToken) throw new Error('Vercel API key is not set');
    this.vercelClient = new Vercel({ bearerToken: vercelToken });
  }
  async requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<DeployAppRequest> {
    // Deploy app to vercel
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId }, relations: ['projectSnapshot', 'deployAppRequest'] });
    if (!project) throw new NotFoundException('Project not found');

    if (!project.projectSnapshot) throw new NotFoundException('Project snapshot not found');
    const createResponse = await this.vercelClient.deployments.createDeployment({
      requestBody: {
        name: project.id, //The project id used in the deployment URL
        target: 'production',
        files: deserializeSnapshot(project.projectSnapshot.files)
      }
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
      idOrUrl: deploymentId
    });

    const deploymentStatus = deploymentStatusResponse.status;
    const deploymentURL = deploymentStatusResponse.url;

    const deployAppReqToSave = {
      ...deployAppReq,
      status: deploymentStatus,
      finalUrl: deploymentURL
    };
    if (deploymentStatus === 'READY') {
      deployAppReqToSave.isDeployed = true;
    }
    if (deploymentStatus === 'ERROR') {
      deployAppReqToSave.message = deploymentStatusResponse.errorMessage || 'Unknown error';
    }
    await this.deployAppRequestRepository.save(deployAppReqToSave);

    return deployAppReq;
  }
}
