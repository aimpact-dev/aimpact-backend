import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReceipts1747925067454 implements MigrationInterface {
    name = 'UpdateReceipts1747925067454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funds_receipts" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" ADD "timestamp" TIMESTAMP NOT NULL`);
    }

}
