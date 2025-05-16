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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../../entities/project.entity");
const project_chat_entity_1 = require("../../entities/project-chat.entity");
const project_chat_response_1 = require("./response/project-chat.response");
const clone_entity_with_new_props_1 = require("../../shared/modules/database/clone-entity-with-new-props");
const crypto_1 = require("crypto");
const project_snapshot_response_1 = require("./response/project-snapshot.response");
const project_snapshot_entity_1 = require("../../entities/project-snapshot.entity");
const project_response_1 = require("./response/project.response");
let ProjectsService = class ProjectsService {
    constructor(projectRepository, projectChatRepository, projectSnapshotRepository) {
        this.projectRepository = projectRepository;
        this.projectChatRepository = projectChatRepository;
        this.projectSnapshotRepository = projectSnapshotRepository;
    }
    async create(userId, dto) {
        const project = this.projectRepository.create({ ...dto, userId });
        const savedProject = await this.projectRepository.save(project);
        return project_response_1.ProjectResponse.fromObject(savedProject);
    }
    async findAll() {
        const projects = await this.projectRepository.find();
        return projects.map(project_response_1.ProjectResponse.fromObject);
    }
    async findOne(id) {
        const project = await this.projectRepository.findOneBy({ id });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project_response_1.ProjectResponse.fromObject(project);
    }
    async getChat(projectId, userId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId, userId },
            relations: ['projectChat'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        if (!project.projectChat) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} has no chat`);
        }
        return project_chat_response_1.ProjectChatResponse.fromObject(project.projectChat);
    }
    async upsertChat(projectId, userId, dto) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId, userId },
            relations: ['projectChat'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        if (!project.projectChat) {
            const newChat = await this.projectChatRepository.save({
                projectId: project.id,
                description: dto.description,
                messages: dto.messages,
                metadata: dto.metadata,
            });
            return project_chat_response_1.ProjectChatResponse.fromObject(newChat);
        }
        const chat = project.projectChat;
        const updatedChatObject = (0, clone_entity_with_new_props_1.cloneEntityWithNewProps)(chat, {
            messages: dto.messages.map((message) => ({
                id: message.id ?? (0, crypto_1.randomUUID)(),
                ...message,
            })),
            description: dto.description,
            metadata: dto.metadata,
        });
        const updatedChat = await this.projectChatRepository.save(updatedChatObject);
        return project_chat_response_1.ProjectChatResponse.fromObject(updatedChat);
    }
    async getSnapshot(projectId, userId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId, userId },
            relations: ['projectSnapshot', 'projectChat'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        if (!project.projectChat) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} has no chat`);
        }
        if (!project.projectSnapshot) {
            return null;
        }
        return project_snapshot_response_1.ProjectSnapshotResponse.fromObject(project.projectSnapshot);
    }
    async upsertSnapshot(projectId, userId, dto) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId, userId },
            relations: ['projectSnapshot', 'projectChat'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        if (!project.projectChat) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} has no chat`);
        }
        if (!project.projectSnapshot) {
            const newSnapshot = await this.projectSnapshotRepository.save({
                projectId: project.id,
                files: dto.files,
                chatIndex: dto.chatIndex,
                summary: dto.summary,
            });
            return project_snapshot_response_1.ProjectSnapshotResponse.fromObject(newSnapshot);
        }
        const snapshot = project.projectSnapshot;
        const updatedSnapshotObject = (0, clone_entity_with_new_props_1.cloneEntityWithNewProps)(snapshot, {
            files: dto.files,
            chatIndex: dto.chatIndex,
            summary: dto.summary,
        });
        const updatedSnapshot = await this.projectSnapshotRepository.save(updatedSnapshotObject);
        return project_snapshot_response_1.ProjectSnapshotResponse.fromObject(updatedSnapshot);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_chat_entity_1.ProjectChat)),
    __param(2, (0, typeorm_1.InjectRepository)(project_snapshot_entity_1.ProjectSnapshot)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map