"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectAndNonce1747248557624 = void 0;
class UserProjectAndNonce1747248557624 {
    constructor() {
        this.name = 'UserProjectAndNonce1747248557624';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "nonce" ("id" SERIAL NOT NULL, "dateOfUsage" TIMESTAMP NOT NULL, "nonce" bigint NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_16620962f69fc3620001801e275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "wallet" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5f6f511ea673346697a431de82a" UNIQUE ("wallet"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "category" character varying, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nonce" ADD CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nonce" DROP CONSTRAINT "FK_d9059f0c9152e2bc9e30bcadafb"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "nonce"`);
    }
}
exports.UserProjectAndNonce1747248557624 = UserProjectAndNonce1747248557624;
//# sourceMappingURL=1747248557624-user-project-and-nonce.js.map