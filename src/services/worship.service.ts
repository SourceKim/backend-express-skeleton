import { AppDataSource } from '@/config/database';
import { WorshipMaterial, WorshipRecord, WorshipMaterialType } from '@/models/worship.model';
import { CreateWorshipRecordDto, CreateWorshipMaterialDto, UpdateWorshipMaterialDto, UpdateWorshipRecordDto } from '@/dtos/worship.dto';
import { HttpException } from '@/exceptions/http.exception';
import { Asset } from '@/models/asset.model';

export class WorshipService {
    private worshipMaterialRepository = AppDataSource.getRepository(WorshipMaterial);
    private worshipRecordRepository = AppDataSource.getRepository(WorshipRecord);
    private assetRepository = AppDataSource.getRepository(Asset);

    // 获取上香素材列表
    async getMaterials(type?: string) {
        const query = this.worshipMaterialRepository.createQueryBuilder('material')
            .leftJoinAndSelect('material.asset', 'asset');

        if (type) {
            query.andWhere('material.type = :type', { type });
        }

        return await query.getMany();
    }

    // 根据ID获取上香素材
    async getMaterialById(id: string) {
        const material = await this.worshipMaterialRepository.findOne({
            where: { id },
            relations: ['asset']
        });

        if (!material) {
            throw new HttpException(404, '上香素材不存在');
        }

        return material;
    }

    // 创建上香素材
    async createMaterial(dto: CreateWorshipMaterialDto) {
        const material = this.worshipMaterialRepository.create({
            title: dto.title,
            description: dto.description || null,
            type: dto.type,
            assetId: dto.assetId || null
        });

        return await this.worshipMaterialRepository.save(material);
    }

    // 更新上香素材
    async updateMaterial(id: string, dto: UpdateWorshipMaterialDto) {
        const material = await this.worshipMaterialRepository.findOne({
            where: { id }
        });

        if (!material) {
            throw new HttpException(404, '上香素材不存在');
        }

        if (dto.title) material.title = dto.title;
        if (dto.description !== undefined) material.description = dto.description;
        if (dto.type) material.type = dto.type;
        if (dto.assetId !== undefined) material.assetId = dto.assetId;

        return await this.worshipMaterialRepository.save(material);
    }

    // 删除上香素材
    async deleteMaterial(id: string) {
        const material = await this.worshipMaterialRepository.findOne({
            where: { id }
        });

        if (!material) {
            throw new HttpException(404, '上香素材不存在');
        }

        // 检查素材是否被使用
        if (material.type === 'buddha') {
            const recordCount = await this.worshipRecordRepository.count({
                where: { buddhaId: id }
            });

            if (recordCount > 0) {
                throw new HttpException(400, '该佛像已被上香记录使用，无法删除');
            }
        }

        // 检查素材是否被上香记录的materials引用
        const recordsWithMaterial = await this.worshipRecordRepository
            .createQueryBuilder('record')
            .where(`JSON_CONTAINS(record.materials, :materialId)`, { materialId: `"${id}"` })
            .getCount();

        if (recordsWithMaterial > 0) {
            throw new HttpException(400, '该素材已被上香记录使用，无法删除');
        }

        await this.worshipMaterialRepository.remove(material);
        return { success: true };
    }

    // 记录上香
    async createRecord(userId: string, dto: CreateWorshipRecordDto) {
        // 验证佛像是否存在
        const buddha = await this.worshipMaterialRepository.findOne({
            where: {
                id: dto.buddhaId,
                type: 'buddha'
            },
            relations: ['asset']
        });
        if (!buddha) {
            throw new HttpException(400, '佛像不存在');
        }

        // 验证素材是否存在
        const materials = await this.worshipMaterialRepository.findByIds(dto.materials);
        if (materials.length !== dto.materials.length) {
            throw new HttpException(400, '部分素材不存在');
        }

        // 创建记录
        const record = this.worshipRecordRepository.create({
            userId,
            buddhaId: dto.buddhaId,
            materials: dto.materials,
            wish: dto.wish
        });

        return await this.worshipRecordRepository.save(record);
    }

    // 获取单个上香记录
    async getRecordById(userId: string, id: string) {
        const record = await this.worshipRecordRepository.findOne({
            where: { id, userId },
            relations: ['buddha', 'buddha.asset']
        });

        if (!record) {
            throw new HttpException(404, '上香记录不存在');
        }

        // 获取相关素材
        const materialsQuery = this.worshipMaterialRepository
            .createQueryBuilder('material')
            .leftJoinAndSelect('material.asset', 'asset')
            .where('material.id IN (:...ids)', { ids: record.materials });
        
        const materials = await materialsQuery.getMany();
        
        return {
            id: record.id,
            buddhaId: record.buddhaId,
            buddha: {
                id: record.buddha.id,
                title: record.buddha.title,
                url: record.buddha.asset?.path
            },
            materials: materials.map(material => ({
                id: material.id,
                title: material.title,
                type: material.type,
                url: material.asset?.path
            })),
            wish: record.wish,
            created_at: record.created_at
        };
    }

    // 更新上香记录
    async updateRecord(userId: string, id: string, dto: UpdateWorshipRecordDto) {
        const record = await this.worshipRecordRepository.findOne({
            where: { id, userId }
        });

        if (!record) {
            throw new HttpException(404, '上香记录不存在');
        }

        // 更新佛像ID
        if (dto.buddhaId) {
            const buddha = await this.worshipMaterialRepository.findOne({
                where: {
                    id: dto.buddhaId,
                    type: 'buddha'
                }
            });
            if (!buddha) {
                throw new HttpException(400, '佛像不存在');
            }
            record.buddhaId = dto.buddhaId;
        }

        // 更新素材列表
        if (dto.materials && dto.materials.length > 0) {
            // 验证素材存在
            const materialsQuery = this.worshipMaterialRepository
                .createQueryBuilder('material')
                .where('material.id IN (:...ids)', { ids: dto.materials });
            
            const materials = await materialsQuery.getMany();
            
            if (materials.length !== dto.materials.length) {
                throw new HttpException(400, '部分素材不存在');
            }
            record.materials = dto.materials;
        }

        // 更新心愿
        if (dto.wish !== undefined) {
            record.wish = dto.wish;
        }

        await this.worshipRecordRepository.save(record);

        // 获取关联的佛像和素材数据
        const buddha = await this.worshipMaterialRepository.findOne({
            where: { id: record.buddhaId },
            relations: ['asset']
        });
        
        // 获取相关素材
        const materialsQuery = this.worshipMaterialRepository
            .createQueryBuilder('material')
            .leftJoinAndSelect('material.asset', 'asset')
            .where('material.id IN (:...ids)', { ids: record.materials });
        
        const materials = await materialsQuery.getMany();

        return {
            id: record.id,
            buddhaId: record.buddhaId,
            buddha: {
                id: buddha!.id,
                title: buddha!.title,
                url: buddha!.asset?.path
            },
            materials: materials.map(material => ({
                id: material.id,
                title: material.title,
                type: material.type,
                url: material.asset?.path
            })),
            wish: record.wish,
            created_at: record.created_at
        };
    }

    // 删除上香记录
    async deleteRecord(userId: string, id: string) {
        const record = await this.worshipRecordRepository.findOne({
            where: { id, userId }
        });

        if (!record) {
            throw new HttpException(404, '上香记录不存在');
        }

        await this.worshipRecordRepository.remove(record);
        return { success: true };
    }

    // 获取上香记录
    async getRecords(userId: string, page = 1, limit = 20) {
        // 获取记录列表
        const [records, total] = await this.worshipRecordRepository.findAndCount({
            where: { userId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['buddha', 'buddha.asset']
        });

        // 获取相关素材
        const result = [];
        for (const record of records) {
            const materialsQuery = this.worshipMaterialRepository
                .createQueryBuilder('material')
                .leftJoinAndSelect('material.asset', 'asset')
                .where('material.id IN (:...ids)', { ids: record.materials });
            
            const materials = await materialsQuery.getMany();

            result.push({
                id: record.id,
                buddhaId: record.buddhaId,
                buddha: {
                    id: record.buddha.id,
                    title: record.buddha.title,
                    url: record.buddha.asset?.path
                },
                materials: materials.map(material => ({
                    id: material.id,
                    title: material.title,
                    type: material.type,
                    url: material.asset?.path
                })),
                wish: record.wish,
                created_at: record.created_at
            });
        }

        return {
            items: result,
            total,
            page,
            limit
        };
    }

    // 获取佛像排行榜
    async getRanking(limit = 10) {
        // 查询排行榜数据
        const result = await this.worshipRecordRepository.createQueryBuilder('record')
            .select('record.buddha_id', 'id')
            .addSelect('COUNT(*)', 'count')
            .groupBy('record.buddha_id')
            .orderBy('count', 'DESC')
            .limit(limit)
            .getRawMany();

        // 获取佛像详情
        const ranking = [];
        for (const item of result) {
            const buddha = await this.worshipMaterialRepository.findOne({
                where: { id: item.id },
                relations: ['asset']
            });
            if (buddha) {
                ranking.push({
                    id: buddha.id,
                    title: buddha.title,
                    description: buddha.description,
                    url: buddha.asset?.path,
                    worshipCount: parseInt(item.count)
                });
            }
        }

        return ranking;
    }
} 