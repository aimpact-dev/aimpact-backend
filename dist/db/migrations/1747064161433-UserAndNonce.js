"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAndNonce1747064161433 = void 0;
class UserAndNonce1747064161433 {
    constructor() {
        this.name = 'UserAndNonce1747064161433';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "nonce" ("id" SERIAL NOT NULL, "dateOfUsage" TIMESTAMP NOT NULL, "nonce" bigint NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_16620962f69fc3620001801e275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wallet" character varying NOT NULL, CONSTRAINT "UQ_c5a97c2e62b0c759e2c16d411cd" UNIQUE ("wallet"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "category" character varying, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nonce" DROP CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "nonce"`);
    }
}
exports.UserAndNonce1747064161433 = UserAndNonce1747064161433;
//# sourceMappingURL=1747064161433-UserAndNonce.js.map