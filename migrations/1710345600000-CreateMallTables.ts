import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMallTables1710345600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建商品分类表
    await queryRunner.createTable(
      new Table({
        name: 'mall_product_category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 创建商品表
    await queryRunner.createTable(
      new Table({
        name: 'mall_product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false
          },
          {
            name: 'stock',
            type: 'int',
            isNullable: false
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: "'active'",
            isNullable: false
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 添加商品表外键
    await queryRunner.createForeignKey(
      'mall_product',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_product_category',
        onDelete: 'SET NULL'
      })
    );

    // 创建商品素材关联表
    await queryRunner.createTable(
      new Table({
        name: 'mall_product_materials',
        columns: [
          {
            name: 'product_id',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'material_id',
            type: 'int',
            isPrimary: true
          }
        ]
      }),
      true
    );

    // 添加商品素材关联表外键
    await queryRunner.createForeignKey(
      'mall_product_materials',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_product',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'mall_product_materials',
      new TableForeignKey({
        columnNames: ['material_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'material',
        onDelete: 'CASCADE'
      })
    );

    // 创建订单表
    await queryRunner.createTable(
      new Table({
        name: 'mall_order',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'order_number',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'paid', 'shipped', 'completed', 'refunding', 'refunded'],
            default: "'pending'",
            isNullable: false
          },
          {
            name: 'remark',
            type: 'text',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 添加订单表外键
    await queryRunner.createForeignKey(
      'mall_order',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE'
      })
    );

    // 创建订单项表
    await queryRunner.createTable(
      new Table({
        name: 'mall_order_item',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 添加订单项表外键
    await queryRunner.createForeignKey(
      'mall_order_item',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_order',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'mall_order_item',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_product',
        onDelete: 'RESTRICT'
      })
    );

    // 创建购物车表
    await queryRunner.createTable(
      new Table({
        name: 'mall_cart',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 添加购物车表外键
    await queryRunner.createForeignKey(
      'mall_cart',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE'
      })
    );

    // 创建购物车项表
    await queryRunner.createTable(
      new Table({
        name: 'mall_cart_item',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'cart_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // 添加购物车项表外键
    await queryRunner.createForeignKey(
      'mall_cart_item',
      new TableForeignKey({
        columnNames: ['cart_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_cart',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'mall_cart_item',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mall_product',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除购物车项表及外键
    await queryRunner.dropTable('mall_cart_item');
    
    // 删除购物车表及外键
    await queryRunner.dropTable('mall_cart');
    
    // 删除订单项表及外键
    await queryRunner.dropTable('mall_order_item');
    
    // 删除订单表及外键
    await queryRunner.dropTable('mall_order');
    
    // 删除商品素材关联表及外键
    await queryRunner.dropTable('mall_product_materials');
    
    // 删除商品表及外键
    await queryRunner.dropTable('mall_product');
    
    // 删除商品分类表
    await queryRunner.dropTable('mall_product_category');
  }
} 