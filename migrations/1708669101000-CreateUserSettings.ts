import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSettings1708669101000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
                        name: "notifications_enabled",
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
    }
} 