"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployAppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deploy_app_request_entity_1 = require("../../entities/deploy-app-request.entity");
const project_entity_1 = require("../../entities/project.entity");
const config_1 = require("@nestjs/config");
const webcontainerSnapshotDeserializer_1 = require("./webcontainerSnapshotDeserializer");
let DeployAppService = class DeployAppService {
    constructor(configService, deployAppRequestRepository, projectRepository) {
        this.configService = configService;
        this.deployAppRequestRepository = deployAppRequestRepository;
        this.projectRepository = projectRepository;
        const vercelToken = this.configService.get('VERCEL_API_KEY');
        if (!vercelToken)
            throw new Error('Vercel API key is not set');
        (async () => {
            const { Vercel } = await import('@vercel/sdk');
            this.vercelClient = new Vercel({ bearerToken: vercelToken });
        })();
    }
    async requestDeployApp(user, dto) {
        const project = await this.projectRepository.findOne({
            where: { id: dto.projectId },
            relations: ['projectSnapshot', 'deployAppRequest'],
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (!project.projectSnapshot)
            throw new common_1.NotFoundException('Project snapshot not found');
        const createResponse = await this.vercelClient.deployments.createDeployment({
            requestBody: {
                name: project.id,
                target: 'production',
                files: (0, webcontainerSnapshotDeserializer_1.deserializeSnapshot)(project.projectSnapshot.files),
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
    async getDeployApp(user, dto) {
        const deployAppReq = await this.deployAppRequestRepository.findOne({
            where: { projectId: dto.projectId },
        });
        if (!deployAppReq)
            throw new common_1.NotFoundException('Deploy Request not found');
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
        if (deploymentStatus === 'READY') {
            deployAppReqToSave.isDeployed = true;
        }
        if (deploymentStatus === 'ERROR') {
            deployAppReqToSave.message = deploymentStatusResponse.errorMessage || 'Unknown error';
        }
        await this.deployAppRequestRepository.save(deployAppReqToSave);
        return deployAppReq;
    }
};
exports.DeployAppService = DeployAppService;
exports.DeployAppService = DeployAppService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(deploy_app_request_entity_1.DeployAppRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DeployAppService);
//# sourceMappingURL=deploy-app.service.js.map