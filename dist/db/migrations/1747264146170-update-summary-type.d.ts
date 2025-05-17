import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdateSummaryType1747264146170 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
