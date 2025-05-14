import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747261085189 implements MigrationInterface {
    name = 'Migrations1747261085189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonce" DROP CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb"`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "nonce" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "nonce" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
