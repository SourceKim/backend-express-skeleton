import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAssetTable1708669350000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "assets",
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
                        name: "filename",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "originalname",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "path",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "mimetype",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "size",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["image", "audio", "video", "document", "other"],
                        default: "'other'",
                        isNullable: false
                    },
                    {
                        name: "category",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "is_public",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "upload_dir",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "文件上传目录"
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "36",
                        isNullable: true,
                        comment: "上传用户ID"
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
                        name: "FK_asset_user",
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("assets");
    }
} 