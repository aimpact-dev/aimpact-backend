import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FundReceipt1747347930105 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
