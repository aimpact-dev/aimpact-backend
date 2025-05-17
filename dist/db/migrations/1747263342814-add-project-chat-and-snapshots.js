"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProjectChatAndSnapshots1747263342814 = void 0;
class AddProjectChatAndSnapshots1747263342814 {
    constructor() {
        this.name = 'AddProjectChatAndSnapshots1747263342814';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "project_chat" ("projectId" uuid NOT NULL, "messages" jsonb NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_84cc1fafc8438c70b26a48ce721" PRIMARY KEY ("projectId"))`);
        await queryRunner.query(`CREATE TABLE "project_snapshot" ("projectId" uuid NOT NULL, "files" jsonb NOT NULL, "summary" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59c52f5ecf6690b513d20ba83bc" PRIMARY KEY ("projectId"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD "userId" uuid NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "project_snapshot"`);
        await queryRunner.query(`DROP TABLE "project_chat"`);
    }
}
exports.AddProjectChatAndSnapshots1747263342814 = AddProjectChatAndSnapshots1747263342814;
//# sourceMappingURL=1747263342814-add-project-chat-and-snapshots.js.map