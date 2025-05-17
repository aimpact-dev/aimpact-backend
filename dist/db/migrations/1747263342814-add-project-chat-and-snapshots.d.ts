import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddProjectChatAndSnapshots1747263342814 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
