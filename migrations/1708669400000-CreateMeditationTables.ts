import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMeditationTables1740022255513 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建冥想素材表
        await queryRunner.createTable(
            new Table({
                name: "meditation_materials",
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
                        name: "title",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["audio", "image", "text", "video"],
                        isNullable: false
                    },
                    {
                        name: "asset_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true
                    },
                    {
                        name: "content",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "duration",
                        type: "int",
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
                ],
                foreignKeys: [
                    {
                        columnNames: ["asset_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "assets",
                        onDelete: "SET NULL"
                    }
                ]
            }),
            true
        );

        // 创建冥想记录表
        await queryRunner.createTable(
            new Table({
                name: "meditation_records",
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
                        name: "materials",
                        type: "json",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["start", "completed", "cancelled"],
                        default: "'start'",
                        isNullable: false
                    },
                    {
                        name: "start_time",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "end_time",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "duration",
                        type: "int",
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
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("meditation_records");
        await queryRunner.dropTable("meditation_materials");
    }
}
