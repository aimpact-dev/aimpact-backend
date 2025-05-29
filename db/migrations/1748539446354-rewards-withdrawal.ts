import { MigrationInterface, QueryRunner } from "typeorm";

export class RewardsWithdrawal1748539446354 implements MigrationInterface {
    name = 'RewardsWithdrawal1748539446354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rewards_withdrawal_receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "amount" numeric(18,9) NOT NULL, "transactionHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_28273c93f1b27c29cdbaa8a74eb" UNIQUE ("transactionHash"), CONSTRAINT "PK_96be6d843583749233a5a05ef4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rewards_withdrawal_receipts" ADD CONSTRAINT "FK_043184e5830dc46381671502910" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards_withdrawal_receipts" DROP CONSTRAINT "FK_043184e5830dc46381671502910"`);
        await queryRunner.query(`DROP TABLE "rewards_withdrawal_receipts"`);
    }

}
