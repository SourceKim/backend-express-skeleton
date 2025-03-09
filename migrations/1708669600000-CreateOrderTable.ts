import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrderTable1708669600000 implements MigrationInterface {
    name = 'CreateOrderTable1708669600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建订单表
        await queryRunner.createTable(
            new Table({
                name: "orders",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true
                    },
                    {
                        name: "order_no",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "36", // 修改为36以匹配UUID格式
                        isNullable: false
                    },
                    {
                        name: "products",
                        type: "json",
                        isNullable: false
                    },
                    {
                        name: "total_amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["pending", "paid", "shipped", "completed", "cancelled"],
                        default: "'pending'",
                        isNullable: false
                    },
                    {
                        name: "address",
                        type: "json",
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
        await queryRunner.dropTable("orders");
    }
} 