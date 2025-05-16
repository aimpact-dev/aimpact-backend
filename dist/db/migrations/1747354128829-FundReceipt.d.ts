import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FundReceipt1747354128829 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
