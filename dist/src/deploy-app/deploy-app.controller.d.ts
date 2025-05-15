import { DeployAppService } from './deploy-app.service';
import { RequestDeployAppDto } from './dto/requestDeployApp.dto';
export declare class DeployAppController {
    private readonly deployAppService;
    constructor(deployAppService: DeployAppService);
    requestDeployApp(dto: RequestDeployAppDto, req: any): Promise<import("../entities/deploy-app-request.entity").DeployAppRequest>;
}
