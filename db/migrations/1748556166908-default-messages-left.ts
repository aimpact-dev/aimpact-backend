import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultMessagesLeft1748556166908 implements MigrationInterface {
    name = 'DefaultMessagesLeft1748556166908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "messagesLeft" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "messagesLeft" SET DEFAULT '3'`);
    }

}
