import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752919751265 implements MigrationInterface {
    name = 'Migrations1752919751265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD "provider" character varying NOT NULL DEFAULT 'Vercel'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "views" integer NOT NULL DEFAULT '0'`);
    }

}
