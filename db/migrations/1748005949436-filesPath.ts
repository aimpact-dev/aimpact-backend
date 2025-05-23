import { MigrationInterface, QueryRunner } from "typeorm";

export class FilesPath1748005949436 implements MigrationInterface {
    name = 'FilesPath1748005949436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_snapshot" RENAME COLUMN "files" TO "filesPath"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "filesPath"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "filesPath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "filesPath"`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "filesPath" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_snapshot" RENAME COLUMN "filesPath" TO "files"`);
    }

}
