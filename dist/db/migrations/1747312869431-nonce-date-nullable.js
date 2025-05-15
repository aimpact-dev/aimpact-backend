"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonceDateNullable1747312869431 = void 0;
class NonceDateNullable1747312869431 {
    constructor() {
        this.name = 'NonceDateNullable1747312869431';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nonce" ALTER COLUMN "dateOfUsage" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nonce" ALTER COLUMN "dateOfUsage" SET NOT NULL`);
    }
}
exports.NonceDateNullable1747312869431 = NonceDateNullable1747312869431;
//# sourceMappingURL=1747312869431-nonce-date-nullable.js.map