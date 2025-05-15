import { MigrationInterface, QueryRunner } from "typeorm";

export class NonceDateNullable1747312869431 implements MigrationInterface {
    name = 'NonceDateNullable1747312869431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonce" ALTER COLUMN "dateOfUsage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonce" ALTER COLUMN "dateOfUsage" SET NOT NULL`);
    }

}
