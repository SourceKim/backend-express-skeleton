import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
                        isNullable: true
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
                        isNullable: true
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true
                    },
                    {
                        name: 'parent_id',
                        type: 'varchar',
                        length: '36',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('materials');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('materials', foreignKey);
            }
        }
        await queryRunner.dropTable('materials');
    }
} 