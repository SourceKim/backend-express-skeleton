import { AppDataSource } from '@/config/database';
import { Asset, AssetType } from '@/models/asset.model';
import { Repository } from 'typeorm';
import { HttpException } from '@/exceptions/http.exception';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export class AssetService {
    private assetRepository: Repository<Asset>;
    private readonly uploadDir: string;
    private readonly baseUrl: string;

    constructor() {
        this.assetRepository = AppDataSource.getRepository(Asset);
        this.uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
        this.baseUrl = process.env.API_URL || 'http://localhost:3000';
    }

    /**
     * 获取资源列表
     * @param page 页码
     * @param limit 每页条数
     * @param type 资源类型
     * @param category 分类
     * @param keyword 搜索关键词
     * @param is_public 是否公开
     * @param user_id 上传用户ID
     * @param sortBy 排序字段
     * @param sortOrder 排序方向
     */
    public async getAssets(
        page = 1,
        limit = 20,
        type?: AssetType,
        category?: string,
        keyword?: string,
        is_public?: boolean,
        user_id?: string,
        sortBy: string = 'created_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ) {
        // 打印输入参数进行调试
        console.log('getAssets 输入参数:', { page, limit, type, category, keyword, is_public, user_id, sortBy, sortOrder });
        
        try {
            const queryBuilder = this.assetRepository.createQueryBuilder('asset');
            
            // 记录是否有任何WHERE条件
            let hasConditions = false;

            if (type) {
                queryBuilder.andWhere('asset.type = :type', { type });
                hasConditions = true;
            }

            if (category) {
                queryBuilder.andWhere('asset.category = :category', { category });
                hasConditions = true;
            }

            if (keyword) {
                queryBuilder.andWhere(
                    '(asset.filename LIKE :keyword OR asset.originalname LIKE :keyword OR asset.description LIKE :keyword)',
                    { keyword: `%${keyword}%` }
                );
                hasConditions = true;
            }

            // 只有当 is_public 有明确定义时才添加该条件
            if (is_public !== undefined) {
                queryBuilder.andWhere('asset.is_public = :is_public', { is_public });
                hasConditions = true;
            }
            
            // 按用户ID筛选
            if (user_id) {
                queryBuilder.andWhere('asset.user_id = :user_id', { user_id });
                hasConditions = true;
            }
            
            // 输出生成的SQL进行调试
            const sql = queryBuilder.getSql();
            console.log('生成的SQL语句:', sql);
            console.log('查询参数:', queryBuilder.getParameters());

            // 如果没有任何条件，打印一条日志
            if (!hasConditions) {
                console.log('未添加任何过滤条件，将返回所有资产');
            }

            // 验证排序字段是否有效
            const validSortFields = ['id', 'filename', 'originalname', 'size', 'type', 'category', 'is_public', 'created_at', 'updated_at'];
            const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';

            const [items, total] = await queryBuilder
                .orderBy(`asset.${actualSortBy}`, sortOrder)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
                
            console.log(`查询结果: 找到 ${total} 条记录，当前页 ${items.length} 条`);
            return { items, total };
        } catch (error) {
            console.error('getAssets 查询出错:', error);
            throw error;
        }
    }

    /**
     * 获取资源详情
     * @param id 资源ID
     */
    public async getAssetById(id: string): Promise<Asset> {
        const asset = await this.assetRepository.findOneBy({ id });
        if (!asset) {
            throw new HttpException(404, '资源不存在');
        }
        return asset;
    }

    /**
     * 创建资源
     * @param assetData 资源数据
     */
    public async createAsset(assetData: Partial<Asset>): Promise<Asset> {
        try {
            const asset = this.assetRepository.create(assetData);
            return await this.assetRepository.save(asset);
        } catch (error) {
            // 如果保存到数据库失败，删除上传的文件
            if (assetData.path && fs.existsSync(assetData.path)) {
                await unlinkAsync(assetData.path);
            }
            throw error;
        }
    }

    /**
     * 更新资源
     * @param id 资源ID
     * @param assetData 更新的数据
     */
    public async updateAsset(id: string, assetData: Partial<Asset>): Promise<Asset> {
        const asset = await this.getAssetById(id);
        Object.assign(asset, assetData);
        return await this.assetRepository.save(asset);
    }

    /**
     * 删除资源
     * @param id 资源ID
     */
    public async deleteAsset(id: string): Promise<void> {
        const asset = await this.getAssetById(id);

        // 从文件系统中删除文件
        if (asset.path && fs.existsSync(asset.path)) {
            await unlinkAsync(asset.path);
        }

        await this.assetRepository.remove(asset);
    }

    /**
     * 获取资源的URL
     * @param asset 资源对象
     */
    public getAssetUrl(asset: Asset): string {
        if (asset.path.startsWith('http')) {
            return asset.path;
        }

        // 提取相对路径，适用于配置的上传目录
        let relativePath: string;
        if (asset.path.includes(this.uploadDir)) {
            relativePath = asset.path.replace(this.uploadDir, '').replace(/\\/g, '/');
        } else {
            // 如果路径不包含上传目录，可能是旧数据，尝试从路径中提取
            const pathParts = asset.path.split(path.sep);
            const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
            
            if (uploadsIndex !== -1) {
                relativePath = '/' + pathParts.slice(uploadsIndex + 1).join('/');
            } else {
                // 无法解析，返回原始路径
                return asset.path;
            }
        }

        return `${this.baseUrl}/uploads${relativePath}`;
    }
} 