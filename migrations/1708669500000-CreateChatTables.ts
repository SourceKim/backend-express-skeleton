import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateChatTables1708669500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建对话表
        await queryRunner.createTable(
            new Table({
                name: "conversations",
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
                        name: "title",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "last_chat_id",
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
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );

        // 创建聊天消息表
        await queryRunner.createTable(
            new Table({
                name: "chats",
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
                        name: "conversation_id",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["user", "assistant", "system"],
                        isNullable: false
                    },
                    {
                        name: "content",
                        type: "text",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["conversation_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "conversations",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("chats");
        await queryRunner.dropTable("conversations");
    }
} 