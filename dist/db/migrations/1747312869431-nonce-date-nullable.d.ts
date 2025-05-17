import { MigrationInterface, QueryRunner } from "typeorm";
export declare class NonceDateNullable1747312869431 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
