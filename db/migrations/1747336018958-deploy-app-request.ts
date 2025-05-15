import { MigrationInterface, QueryRunner } from "typeorm";

export class DeployAppRequest1747336018958 implements MigrationInterface {
    name = 'DeployAppRequest1747336018958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deploy_app_request" ("projectId" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeployed" boolean NOT NULL DEFAULT false, "message" character varying, "finalUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cbc26792683352d2d0962c28586" PRIMARY KEY ("projectId"))`);
        await queryRunner.query(`ALTER TABLE "project_chat" ADD CONSTRAINT "FK_84cc1fafc8438c70b26a48ce721" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD CONSTRAINT "FK_59c52f5ecf6690b513d20ba83bc" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deploy_app_request" ADD CONSTRAINT "FK_cbc26792683352d2d0962c28586" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_app_request" DROP CONSTRAINT "FK_cbc26792683352d2d0962c28586"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP CONSTRAINT "FK_59c52f5ecf6690b513d20ba83bc"`);
        await queryRunner.query(`ALTER TABLE "project_chat" DROP CONSTRAINT "FK_84cc1fafc8438c70b26a48ce721"`);
        await queryRunner.query(`DROP TABLE "deploy_app_request"`);
    }

}
