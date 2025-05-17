"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSummaryType1747264146170 = void 0;
class UpdateSummaryType1747264146170 {
    constructor() {
        this.name = 'UpdateSummaryType1747264146170';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "summary" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "summary" character varying`);
    }
}
exports.UpdateSummaryType1747264146170 = UpdateSummaryType1747264146170;
//# sourceMappingURL=1747264146170-update-summary-type.js.map