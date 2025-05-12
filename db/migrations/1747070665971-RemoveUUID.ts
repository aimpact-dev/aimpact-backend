import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUUID1747070665971 implements MigrationInterface {
    name = 'RemoveUUID1747070665971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb"`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonce" DROP CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "nonce" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
    }

}
