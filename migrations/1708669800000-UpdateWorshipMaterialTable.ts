import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UpdateWorshipMaterialTable1708669800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const worshipMaterialsTable = await queryRunner.getTable('worship_materials');
        if (!worshipMaterialsTable) {
            console.log('worship_materials表不存在，无法更新');
            return;
        }

        // 1. 删除原有字段
        // 检查并删除sub_type字段
        const subTypeColumn = worshipMaterialsTable.findColumnByName('sub_type');
        if (subTypeColumn) {
            await queryRunner.dropColumn('worship_materials', 'sub_type');
            console.log('成功删除sub_type字段');
        }

        // 检查并删除url字段
        const urlColumn = worshipMaterialsTable.findColumnByName('url');
        if (urlColumn) {
            await queryRunner.dropColumn('worship_materials', 'url');
            console.log('成功删除url字段');
        }

        // 2. 更新type字段枚举值
        const typeColumn = worshipMaterialsTable.findColumnByName('type');
        if (typeColumn) {
            await queryRunner.dropColumn('worship_materials', 'type');
            console.log('成功删除旧的type字段');

            await queryRunner.addColumn(
                'worship_materials',
                new TableColumn({
                    name: 'type',
                    type: 'enum',
                    enum: ['incense_burner', 'incense', 'buddha', 'wish'],
                    isNullable: false
                })
            );
            console.log('成功添加新的type字段');
        }

        // 3. 添加asset_id字段
        const assetIdColumn = worshipMaterialsTable.findColumnByName('asset_id');
        if (!assetIdColumn) {
            await queryRunner.addColumn(
                'worship_materials',
                new TableColumn({
                    name: 'asset_id',
                    type: 'varchar',
                    length: '36',
                    isNullable: true
                })
            );
            console.log('成功添加asset_id字段');

            // 添加外键
            await queryRunner.createForeignKey(
                'worship_materials',
                new TableForeignKey({
                    name: 'FK_worship_material_asset',
                    columnNames: ['asset_id'],
                    referencedTableName: 'assets',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL'
                })
            );
            console.log('成功创建asset_id外键');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const worshipMaterialsTable = await queryRunner.getTable('worship_materials');
        if (!worshipMaterialsTable) {
            console.log('worship_materials表不存在，无法回滚');
            return;
        }

        // 1. 删除asset_id外键
        const assetForeignKey = worshipMaterialsTable.foreignKeys.find(fk => 
            fk.columnNames.indexOf('asset_id') !== -1 && 
            fk.referencedTableName === 'assets'
        );
        if (assetForeignKey) {
            await queryRunner.dropForeignKey('worship_materials', assetForeignKey);
            console.log('成功删除asset_id外键');
        }

        // 2. 删除asset_id字段
        const assetIdColumn = worshipMaterialsTable.findColumnByName('asset_id');
        if (assetIdColumn) {
            await queryRunner.dropColumn('worship_materials', 'asset_id');
            console.log('成功删除asset_id字段');
        }

        // 3. 恢复旧的type字段
        const typeColumn = worshipMaterialsTable.findColumnByName('type');
        if (typeColumn) {
            await queryRunner.dropColumn('worship_materials', 'type');
            console.log('成功删除新的type字段');

            await queryRunner.addColumn(
                'worship_materials',
                new TableColumn({
                    name: 'type',
                    type: 'enum',
                    enum: ['audio', 'image', 'text'],
                    isNullable: false
                })
            );
            console.log('成功恢复旧的type字段');
        }

        // 4. 恢复url字段
        await queryRunner.addColumn(
            'worship_materials',
            new TableColumn({
                name: 'url',
                type: 'varchar',
                length: '255',
                isNullable: false
            })
        );
        console.log('成功恢复url字段');

        // 5. 恢复sub_type字段
        await queryRunner.addColumn(
            'worship_materials',
            new TableColumn({
                name: 'sub_type',
                type: 'enum',
                enum: ['incense_burner', 'buddha', 'incense'],
                isNullable: true
            })
        );
        console.log('成功恢复sub_type字段');
    }
} 