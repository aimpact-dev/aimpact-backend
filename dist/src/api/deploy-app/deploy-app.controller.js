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
exports.DeployAppController = void 0;
const common_1 = require("@nestjs/common");
const deploy_app_service_1 = require("./deploy-app.service");
const requestDeployApp_dto_1 = require("./dto/requestDeployApp.dto");
const api_context_decorator_1 = require("../auth/decorator/api-context.decorator");
const user_entity_1 = require("../../entities/user.entity");
const getDeployApp_dto_1 = require("./dto/getDeployApp.dto");
let DeployAppController = class DeployAppController {
    constructor(deployAppService) {
        this.deployAppService = deployAppService;
    }
    requestDeployApp(user, dto) {
        return this.deployAppService.requestDeployApp(user, dto);
    }
    getDeployApp(user, dto) {
        return this.deployAppService.getDeployApp(user, dto);
    }
};
exports.DeployAppController = DeployAppController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, requestDeployApp_dto_1.RequestDeployAppDto]),
    __metadata("design:returntype", void 0)
], DeployAppController.prototype, "requestDeployApp", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, getDeployApp_dto_1.GetDeployAppDto]),
    __metadata("design:returntype", void 0)
], DeployAppController.prototype, "getDeployApp", null);
exports.DeployAppController = DeployAppController = __decorate([
    (0, common_1.Controller)('deploy-app'),
    __metadata("design:paramtypes", [deploy_app_service_1.DeployAppService])
], DeployAppController);
//# sourceMappingURL=deploy-app.controller.js.map