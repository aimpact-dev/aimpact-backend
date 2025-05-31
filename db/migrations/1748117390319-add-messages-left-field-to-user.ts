import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessagesLeftFieldToUser1748117390319 implements MigrationInterface {
    name = 'AddMessagesLeftFieldToUser1748117390319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "messagesLeft" integer NOT NULL DEFAULT '3'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "messagesLeft"`);
    }

}
