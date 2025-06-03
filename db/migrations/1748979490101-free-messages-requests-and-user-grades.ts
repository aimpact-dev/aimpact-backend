import { MigrationInterface, QueryRunner } from "typeorm";

export class FreeMessagesRequestsAndUserGrades1748979490101 implements MigrationInterface {
    name = 'FreeMessagesRequestsAndUserGrades1748979490101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "grade" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3b839d5141ed3bddc9861072c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "free_messages_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "twitterHandle" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "completed" boolean NOT NULL DEFAULT false, "messages" integer NOT NULL, CONSTRAINT "UQ_e866aa7d5a30b11419a94e2bf38" UNIQUE ("twitterHandle"), CONSTRAINT "PK_d31b60d2b4db3283e6799cb05b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "free_messages_requests" ADD CONSTRAINT "FK_16b9e88912a79de9d30114243d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "free_messages_requests" DROP CONSTRAINT "FK_16b9e88912a79de9d30114243d5"`);
        await queryRunner.query(`DROP TABLE "free_messages_requests"`);
        await queryRunner.query(`DROP TABLE "user_grades"`);
    }

}
