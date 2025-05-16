import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedDeployEntity1747426774869 implements MigrationInterface {
    name = 'UpdatedDeployEntity1747426774869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "deploymentId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "deploymentId"`);
    }

}
