import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UserAndNonce1747064161433 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
