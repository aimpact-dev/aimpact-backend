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
const jwt_auth_guard_1 = require("../api/auth/jwt-auth.guard");
let DeployAppController = class DeployAppController {
    constructor(deployAppService) {
        this.deployAppService = deployAppService;
    }
    requestDeployApp(dto, req) {
        return this.deployAppService.requestDeployApp(req.user, dto);
    }
};
exports.DeployAppController = DeployAppController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requestDeployApp_dto_1.RequestDeployAppDto, Object]),
    __metadata("design:returntype", void 0)
], DeployAppController.prototype, "requestDeployApp", null);
exports.DeployAppController = DeployAppController = __decorate([
    (0, common_1.Controller)('deploy-app'),
    __metadata("design:paramtypes", [deploy_app_service_1.DeployAppService])
], DeployAppController);
//# sourceMappingURL=deploy-app.controller.js.map