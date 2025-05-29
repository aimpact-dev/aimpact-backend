import { MigrationInterface, QueryRunner } from "typeorm";

export class ReferralRewards1748523878650 implements MigrationInterface {
    name = 'ReferralRewards1748523878650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "referralsRewards" numeric(18,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "referralsRewards"`);
    }

}
