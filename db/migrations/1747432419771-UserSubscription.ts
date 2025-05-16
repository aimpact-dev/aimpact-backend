import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSubscription1747432419771 implements MigrationInterface {
    name = 'UserSubscription1747432419771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "subscriptionStart" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "subscriptionEnd" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "subscriptionEnd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "subscriptionStart"`);
    }

}
