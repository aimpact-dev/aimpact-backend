import { MigrationInterface, QueryRunner } from "typeorm";

export class S3Deployment1749076300009 implements MigrationInterface {
    name = 'S3Deployment1749076300009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "s3_deployments" ("projectId" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4b79f115ad5c2f8f9d5ebe7dfa" PRIMARY KEY ("projectId"))`);
        await queryRunner.query(`ALTER TABLE "s3_deployments" ADD CONSTRAINT "FK_d4b79f115ad5c2f8f9d5ebe7dfa" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s3_deployments" DROP CONSTRAINT "FK_d4b79f115ad5c2f8f9d5ebe7dfa"`);
        await queryRunner.query(`DROP TABLE "s3_deployments"`);
    }

}
