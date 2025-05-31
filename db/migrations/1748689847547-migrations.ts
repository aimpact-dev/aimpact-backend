import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748689847547 implements MigrationInterface {
    name = 'Migrations1748689847547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "claimedFreeMessages" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "claimedFreeMessages"`);
    }

}
