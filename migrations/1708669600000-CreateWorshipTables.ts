import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateWorshipTables1708669600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建上香素材表
        await queryRunner.createTable(
            new Table({
                name: "worship_materials",
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
                        enum: ["incense_burner", "incense", "buddha", "wish"],
                        isNullable: false
                    },
                    {
                        name: "asset_id",
                        type: "varchar",
                        length: "36",
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

        // 创建上香记录表
        await queryRunner.createTable(
            new Table({
                name: "worship_records",
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
                        name: "buddha_id",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "materials",
                        type: "json",
                        isNullable: false
                    },
                    {
                        name: "wish",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["buddha_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "worship_materials",
                        onDelete: "RESTRICT"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("worship_records");
        await queryRunner.dropTable("worship_materials");
    }
} 