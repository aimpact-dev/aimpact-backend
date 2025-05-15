import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { Project } from 'src/entities/project.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DeployAppService {
  constructor(
    @InjectRepository(DeployAppRequest)
    private readonly deployAppRequestRepository: Repository<DeployAppRequest>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<DeployAppRequest> {  // Deploy app to vercel
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException("Project not found");

    const vercelApiKey = process.env.VERCEL_API_KEY;
    const deployRequest = await this.deployAppRequestRepository.create({
      project,
    });

    // Create task here for deploying
    // ...

    return deployRequest;
  }

  async getDeployApp(user: User, dto: GetDeployAppDto): Promise<DeployAppRequest> {
    const deployAppReq = await this.deployAppRequestRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!deployAppReq) throw new NotFoundException("Deploy Request not found");

    return deployAppReq;
  }

  async listDeployApp() {
    // ...
  }
}
