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

        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['material_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'material_categories',
                onDelete: 'SET NULL'
            })
        );

        // 创建索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_TYPE',
                columnNames: ['type']
            })
        );

        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_CATEGORY',
                columnNames: ['category']
            })
        );

        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_IS_PUBLIC',
                columnNames: ['is_public']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除外键约束
        const materialTable = await queryRunner.getTable('materials');
        if (materialTable) {
            const foreignKeys = materialTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('materials', foreignKey);
            }
        }

        // 删除索引
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_TYPE');
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_CATEGORY');
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_IS_PUBLIC');

        // 删除表
        await queryRunner.dropTable('materials', true);
        await queryRunner.dropTable('material_categories', true);
        await queryRunner.dropTable('material_tags', true);
    }
} 