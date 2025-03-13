import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermission1708669200000 implements MigrationInterface {
    name = 'CreatePermission1708669200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建权限表
        await queryRunner.query(`
            CREATE TABLE permissions (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                resource VARCHAR(255) NOT NULL,
                action VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除权限表
        await queryRunner.query(`DROP TABLE permissions`);
    }
} 