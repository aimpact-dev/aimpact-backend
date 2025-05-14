import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSummaryType1747264146170 implements MigrationInterface {
    name = 'UpdateSummaryType1747264146170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "summary" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "summary" character varying`);
    }

}
