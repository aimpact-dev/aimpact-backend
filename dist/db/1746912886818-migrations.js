"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1746912886818 = void 0;
class Migrations1746912886818 {
    constructor() {
        this.name = 'Migrations1746912886818';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "category" character varying, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "project"`);
    }
}
exports.Migrations1746912886818 = Migrations1746912886818;
//# sourceMappingURL=1746912886818-migrations.js.map