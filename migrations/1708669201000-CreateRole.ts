import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRole1708669201000 implements MigrationInterface {
    name = 'CreateRole1708669201000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建角色表
        await queryRunner.query(`
            CREATE TABLE roles (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description VARCHAR(255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            )
        `);

        // 创建角色-权限关联表
        await queryRunner.query(`
            CREATE TABLE role_permissions (
                role_id VARCHAR(36) NOT NULL,
                permission_id VARCHAR(36) NOT NULL,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            )
        `);

        // 创建用户-角色关联表
        await queryRunner.query(`
            CREATE TABLE user_roles (
                user_id VARCHAR(36) NOT NULL,
                role_id VARCHAR(36) NOT NULL,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            )
        `);

        // 插入默认角色
        await queryRunner.query(`
            INSERT INTO roles (id, name, description) VALUES
            (UUID(), 'super_admin', '超级管理员'),
            (UUID(), 'admin', '管理员'),
            (UUID(), 'moderator', '版主')
        `);

        // 为超级管理员分配所有权限
        await queryRunner.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id
            FROM roles r
            CROSS JOIN permissions p
            WHERE r.name = 'super_admin'
        `);

        // 为管理员分配部分权限
        await queryRunner.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id
            FROM roles r
            CROSS JOIN permissions p
            WHERE r.name = 'admin'
            AND p.name IN ('user:read', 'user:write', 'chat:read', 'chat:delete')
        `);

        // 为版主分配基本权限
        await queryRunner.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id
            FROM roles r
            CROSS JOIN permissions p
            WHERE r.name = 'moderator'
            AND p.name IN ('user:read', 'chat:read')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_roles`);
        await queryRunner.query(`DROP TABLE IF EXISTS role_permissions`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    }
} 