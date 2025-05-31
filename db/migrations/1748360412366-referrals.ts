import { MigrationInterface, QueryRunner } from "typeorm";

export class Referrals1748360412366 implements MigrationInterface {
    name = 'Referrals1748360412366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE OR REPLACE FUNCTION randomInviteCode() RETURNS character varying(6) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    code TEXT := '';
BEGIN
    FOR i IN 1..6 LOOP
            code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;`);
        await queryRunner.query(`ALTER TABLE "user" ADD "inviteCode" character varying(6) NOT NULL DEFAULT randomInviteCode()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "uq_invite_code" UNIQUE ("inviteCode")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "referrerId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "discountPercent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "inviteCode" SET DEFAULT randomInviteCode()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "fk_referrerId" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk_referrerId"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "inviteCode" SET DEFAULT randomInviteCode()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "discountPercent"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "referrerId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq_invite_code"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "inviteCode"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS randomInviteCode()`);
    }

}
