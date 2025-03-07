import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTables1708669100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建用户表
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "16",
                        isPrimary: true
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "nickname",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                        isUnique: true
                    },
                    {
                        name: "avatar",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "bio",
                        type: "varchar",
                        length: "500",
                        isNullable: true
                    },
                    {
                        name: "merit_points",
                        type: "int",
                        default: "0",
                        isNullable: false
                    },
                    {
                        name: "meditation_minutes",
                        type: "int",
                        default: "0",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive", "banned"],
                        default: "'active'",
                        isNullable: false
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "last_login",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // 创建用户设置表
        await queryRunner.createTable(
            new Table({
                name: "user_settings",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "16",
                        isNullable: false
                    },
                    {
                        name: "theme",
                        type: "varchar",
                        length: "20",
                        default: "'light'",
                        isNullable: false
                    },
                    {
                        name: "language",
                        type: "varchar",
                        length: "10",
                        default: "'zh-CN'",
                        isNullable: false
                    },
                    {
                        name: "notification_enabled",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_settings");
        await queryRunner.dropTable("users");
    }
} 