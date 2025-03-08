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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
} 