import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableColumn } from 'typeorm';

export class CreateMaterialTable1708669700000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'materials',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'filename',
                        type: 'varchar',
                        length: '100',
                        isNullable: true
                    },
                    {
                        name: 'originalname',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'path',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'mimetype',
                        type: 'varchar',
                        length: '100',
                        isNullable: true
                    },
                    {
                        name: 'size',
                        type: 'int',
                        isNullable: true
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['image', 'audio', 'video', 'document', 'text', 'other'],
                        default: "'other'"
                    },
                    {
                        name: 'category',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                        comment: '素材分类，用于对素材进行分类管理'
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true
                    },
                    {
                        name: 'is_public',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'upload_dir',
                        type: 'varchar',
                        length: '255',
                        isNullable: true
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true
                    },
                    {
                        name: 'tags',
                        type: 'json',
                        isNullable: true,
                        comment: '素材标签，存储为JSON数组'
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
                        comment: '素材元数据，可存储分类描述等额外信息'
                    },
                    {
                        name: 'parent_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true,
                        comment: '父素材ID，用于版本管理'
                    },
                    {
                        name: 'material_category_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true,
                        comment: '素材分类ID，关联到material_categories表'
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
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    }
                ]
            }),
            true
        );

        // 创建材料分类表
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`material_categories\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(50) NOT NULL,
                \`description\` varchar(200) DEFAULT NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`deleted_at\` timestamp NULL DEFAULT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`UQ_MATERIAL_CATEGORIES_NAME\` (\`name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 创建材料标签表
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`material_tags\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(50) NOT NULL,
                \`description\` varchar(200) DEFAULT NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`deleted_at\` timestamp NULL DEFAULT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`UQ_MATERIAL_TAGS_NAME\` (\`name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 创建材料-标签关联表
        await queryRunner.createTable(
            new Table({
                name: 'material_to_tags',
                columns: [
                    {
                        name: 'material_id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'tag_id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['material_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'materials',
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['tag_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'material_tags',
                        onDelete: 'CASCADE'
                    }
                ]
            }),
            true
        );

        // 添加外键约束
        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL'
            })
        );

        // 添加自引用外键约束
        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['parent_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'materials',
                onDelete: 'SET NULL'
            })
        );

        // 添加素材分类外键约束
        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['material_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'material_categories',
                onDelete: 'SET NULL'
            })
        );

        // 添加分类索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_CATEGORY',
                columnNames: ['category']
            })
        );

        // 添加素材分类ID索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_MATERIAL_CATEGORY_ID',
                columnNames: ['material_category_id']
            })
        );

        // 添加类型索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_TYPE',
                columnNames: ['type']
            })
        );

        // 添加公开状态索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_PUBLIC',
                columnNames: ['is_public']
            })
        );

        // 添加父素材索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_PARENT_ID',
                columnNames: ['parent_id']
            })
        );

        // 添加复合索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_CATEGORY_TYPE',
                columnNames: ['category', 'type']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除材料-标签关联表
        await queryRunner.dropTable('material_to_tags', true);
        
        // 删除标签表
        await queryRunner.query(`DROP TABLE IF EXISTS \`material_tags\``);
        
        // 删除分类表
        await queryRunner.query(`DROP TABLE IF EXISTS \`material_categories\``);
        
        // 删除材料表及其外键和索引
        const table = await queryRunner.getTable('materials');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('materials', foreignKey);
            }
            
            const indices = table.indices;
            for (const index of indices) {
                await queryRunner.dropIndex('materials', index);
            }
        }
        
        await queryRunner.dropTable('materials');
    }
} 