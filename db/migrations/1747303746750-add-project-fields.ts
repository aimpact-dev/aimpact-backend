import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectFields1747303746750 implements MigrationInterface {
  name = 'AddProjectFields1747303746750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_snapshot" ADD "chatIndex" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project_chat" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_chat" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "project_snapshot" DROP COLUMN "chatIndex"`);
  }
}
