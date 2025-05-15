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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSnapshotResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectSnapshotResponse {
    static fromObject(projectSnapshot) {
        return {
            projectId: projectSnapshot.projectId,
            files: projectSnapshot.files,
            chatIndex: projectSnapshot.chatIndex,
            summary: projectSnapshot.summary,
            updatedAt: projectSnapshot.updatedAt,
        };
    }
}
exports.ProjectSnapshotResponse = ProjectSnapshotResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectSnapshotResponse.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ProjectSnapshotResponse.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProjectSnapshotResponse.prototype, "chatIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", String)
], ProjectSnapshotResponse.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], ProjectSnapshotResponse.prototype, "updatedAt", void 0);
//# sourceMappingURL=project-snapshot.response.js.map