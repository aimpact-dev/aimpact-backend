import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { Repository } from 'typeorm';
import { DeployAppRequest } from 'src/entities/deploy-app-request.entity';
import { Project } from 'src/entities/project.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
export declare class DeployAppService {
    private readonly configService;
    private readonly deployAppRequestRepository;
    private readonly projectRepository;
    private vercelClient;
    constructor(configService: ConfigService, deployAppRequestRepository: Repository<DeployAppRequest>, projectRepository: Repository<Project>);
    requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<DeployAppRequest>;
    getDeployApp(user: User, dto: GetDeployAppDto): Promise<DeployAppRequest>;
}
