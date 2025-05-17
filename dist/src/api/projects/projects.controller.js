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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const CreateProjectDto_1 = require("./dto/CreateProjectDto");
const project_chat_request_1 = require("./request/project-chat.request");
const project_snapshot_request_1 = require("./request/project-snapshot.request");
const public_decorator_1 = require("../auth/decorator/public.decorator");
const api_context_decorator_1 = require("../auth/decorator/api-context.decorator");
const user_entity_1 = require("../../entities/user.entity");
let ProjectsController = class ProjectsController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async create(user, dto) {
        return this.projectService.create(user.id, dto);
    }
    async findAll() {
        return this.projectService.findAll();
    }
    async findOne(id) {
        return this.projectService.findOne(id);
    }
    async getChat(user, id) {
        return this.projectService.getChat(id, user.id);
    }
    async upsertChat(user, id, dto) {
        return this.projectService.upsertChat(id, user.id, dto);
    }
    async getSnapshot(user, id) {
        return this.projectService.getSnapshot(id, user.id);
    }
    async upsertSnapshot(user, id, dto) {
        return this.projectService.upsertSnapshot(id, user.id, dto);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, CreateProjectDto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/chat'),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getChat", null);
__decorate([
    (0, common_1.Post)(':id/chat'),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, project_chat_request_1.ProjectChatRequest]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "upsertChat", null);
__decorate([
    (0, common_1.Get)(':id/snapshot'),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Post)(':id/snapshot'),
    __param(0, (0, api_context_decorator_1.ApiContext)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, project_snapshot_request_1.ProjectSnapshotRequest]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "upsertSnapshot", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map