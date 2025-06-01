import { MigrationInterface, QueryRunner } from "typeorm";

export class TotalEarnedRewards1748725031557 implements MigrationInterface {
    name = 'TotalEarnedRewards1748725031557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "totalEarnedRewards" numeric(18,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "totalEarnedRewards"`);
    }

}
