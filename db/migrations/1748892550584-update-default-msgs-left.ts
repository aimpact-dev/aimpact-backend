import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefaultMsgsLeft1748892550584 implements MigrationInterface {
    name = 'UpdateDefaultMsgsLeft1748892550584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "messagesLeft" SET DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "messagesLeft" SET DEFAULT '0'`);
    }

}
