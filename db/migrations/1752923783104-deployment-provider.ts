import { MigrationInterface, QueryRunner } from "typeorm";

export class DeploymentProvider1752923783104 implements MigrationInterface {
    name = 'DeploymentProvider1752923783104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "provider" character varying NOT NULL DEFAULT 'Vercel'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "provider"`);
    }

}
