"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundReceipt1747354128829 = void 0;
class FundReceipt1747354128829 {
    constructor() {
        this.name = 'FundReceipt1747354128829';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "funds_receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "timestamp" TIMESTAMP NOT NULL, "amount" numeric(18,9) NOT NULL, "transactionHash" character varying NOT NULL, CONSTRAINT "UQ_a636200b477029aa58506e98866" UNIQUE ("transactionHash"), CONSTRAINT "PK_00e186e5caaf638348ad6241d0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "funds_receipts" ADD CONSTRAINT "FK_a1cf53fba65f603df5a4b2b179f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "funds_receipts" DROP CONSTRAINT "FK_a1cf53fba65f603df5a4b2b179f"`);
        await queryRunner.query(`DROP TABLE "funds_receipts"`);
    }
}
exports.FundReceipt1747354128829 = FundReceipt1747354128829;
//# sourceMappingURL=1747354128829-FundReceipt.js.map