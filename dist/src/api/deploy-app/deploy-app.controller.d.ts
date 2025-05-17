import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
import { User } from 'src/entities/user.entity';
import { GetDeployAppDto } from './dto/getDeployApp.dto';
export declare class DeployAppController {
    private readonly deployAppService;
    constructor(deployAppService: DeployAppService);
    requestDeployApp(user: User, dto: RequestDeployAppDto): Promise<import("../../entities/deploy-app-request.entity").DeployAppRequest>;
    getDeployApp(user: User, dto: GetDeployAppDto): Promise<import("../../entities/deploy-app-request.entity").DeployAppRequest>;
}
