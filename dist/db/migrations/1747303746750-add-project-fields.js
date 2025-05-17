"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProjectFields1747303746750 = void 0;
class AddProjectFields1747303746750 {
    constructor() {
        this.name = 'AddProjectFields1747303746750';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "chatIndex" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_chat" ADD "description" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "project_chat" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "chatIndex"`);
    }
}
exports.AddProjectFields1747303746750 = AddProjectFields1747303746750;
//# sourceMappingURL=1747303746750-add-project-fields.js.map