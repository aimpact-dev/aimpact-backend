import { MigrationInterface, QueryRunner } from "typeorm";

export class DeploymentLogs1748195654099 implements MigrationInterface {
    name = 'DeploymentLogs1748195654099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "logs" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "logs"`);
    }

}
