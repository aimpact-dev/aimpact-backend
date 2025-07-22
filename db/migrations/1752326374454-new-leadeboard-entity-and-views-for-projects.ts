import { MigrationInterface, QueryRunner } from "typeorm";

export class NewLeadeboardEntityAndViewsForProjects1752326374454 implements MigrationInterface {
    name = 'NewLeadeboardEntityAndViewsForProjects1752326374454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leaderboard" ("user_id" uuid NOT NULL, "points" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f8c0444d594f510f473a6392e4d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE INDEX "idx_leaderboard_points_desc" ON "leaderboard" ("points") `);
        await queryRunner.query(`ALTER TABLE "project" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "leaderboard" ADD CONSTRAINT "FK_f8c0444d594f510f473a6392e4d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leaderboard" DROP CONSTRAINT "FK_f8c0444d594f510f473a6392e4d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "views"`);
        await queryRunner.query(`DROP INDEX "public"."idx_leaderboard_points_desc"`);
        await queryRunner.query(`DROP TABLE "leaderboard"`);
    }

}
