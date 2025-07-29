import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddPendingMessagesToUser1753797810757 implements MigrationInterface {
    name = ' $addPendingMessagesToUser1753797810757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pendingMessages" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pendingMessages"`);
    }

}
