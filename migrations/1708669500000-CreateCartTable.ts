import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCartTable1708669500000 implements MigrationInterface {
    name = 'CreateCartTable1708669500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建购物车表
        await queryRunner.createTable(
            new Table({
                name: "cart_items",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "16",
                        isNullable: false
                    },
                    {
                        name: "product_id",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false,
                        default: 1
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
                    },
                    {
                        columnNames: ["product_id"],
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "idx_cart_user_product",
                        columnNames: ["user_id", "product_id"],
                        isUnique: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_items");
    }
} 