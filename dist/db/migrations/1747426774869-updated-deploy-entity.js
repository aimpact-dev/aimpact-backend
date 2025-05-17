"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedDeployEntity1747426774869 = void 0;
class UpdatedDeployEntity1747426774869 {
    constructor() {
        this.name = 'UpdatedDeployEntity1747426774869';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "deploymentId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "status" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "deploymentId"`);
    }
}
exports.UpdatedDeployEntity1747426774869 = UpdatedDeployEntity1747426774869;
//# sourceMappingURL=1747426774869-updated-deploy-entity.js.map