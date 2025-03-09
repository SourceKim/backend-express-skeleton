import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductTable1708669400000 implements MigrationInterface {
    name = 'CreateProductTable1708669400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建产品分类表
        await queryRunner.query(`
            CREATE TABLE product_categories (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description VARCHAR(255),
                parent_id VARCHAR(36),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
            )
        `);

        // 创建产品表
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: false
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "stock",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "image",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "category",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive", "out_of_stock"],
                        default: "'active'",
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
                ]
            }),
            true
        );

        // 插入默认产品分类
        await queryRunner.query(`
            INSERT INTO product_categories (id, name, description) VALUES
            (UUID(), '电子产品', '电子设备和配件'),
            (UUID(), '服装', '各类服装和配饰'),
            (UUID(), '家居', '家居用品和装饰'),
            (UUID(), '食品', '食品和饮料')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
        await queryRunner.query(`DROP TABLE IF EXISTS product_categories`);
    }
} 