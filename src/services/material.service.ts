import { AppDataSource } from '@/config/database';
import { Material, MaterialType } from '@/models/material.model';
import { Repository, FindOptionsWhere, Like, In } from 'typeorm';
import { HttpException } from '@/exceptions/http.exception';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { nanoid } from 'nanoid';
import { ENV } from '@/config/env.config';
import multer from 'multer';

const unlinkAsync = promisify(fs.unlink);

/**
 * 素材查询过滤器接口
 */
export interface MaterialFilter {
    /** 素材ID或ID数组 */
    id?: string | string[];
    /** 素材类型或类型数组 */
    type?: MaterialType | MaterialType[];
    /** 素材分类或分类数组 */
    category?: string | string[];
    /** 素材标签或标签数组 */
    tags?: string | string[];
    /** 搜索关键词 */
    keyword?: string;
    /** 是否公开 */
    is_public?: boolean;
    /** 父素材ID */
    parent_id?: string;
    /** 创建时间起始 */
    created_after?: Date;
    /** 创建时间截止 */
    created_before?: Date;
    /** 最小文件大小 */
    min_size?: number;
    /** 最大文件大小 */
    max_size?: number;
    /** 自定义过滤条件 */
    custom_filter?: Record<string, any>;
}

/**
 * 素材处理操作接口
 */
export interface ProcessOperation {
    /** 操作名称 */
    name: string;
    /** 操作参数 */
    params?: Record<string, any>;
}

/**
 * 素材上传选项接口
 */
export interface UploadOptions {
    /** 素材分类 */
    category?: string;
    /** 素材标签 */
    tags?: string[];
    /** 素材描述 */
    description?: string;
    /** 是否公开 */
    is_public?: boolean;
    /** 素材元数据 */
    metadata?: Record<string, any>;
    /** 父素材ID */
    parent_id?: string;
    /** 处理操作 */
    process_operations?: ProcessOperation[];
}

/**
 * 文本素材创建选项接口
 */
export interface TextMaterialOptions {
    /** 文本内容 */
    content: string;
    /** 素材分类 */
    category?: string;
    /** 素材标签 */
    tags?: string[];
    /** 是否公开 */
    is_public?: boolean;
    /** 素材元数据 */
    metadata?: Record<string, any>;
    /** 父素材ID */
    parent_id?: string;
}

/**
 * 素材服务类
 * 提供素材的上传、查询、处理等功能
 */
export class MaterialService {
    /** 素材仓库 */
    private materialRepository: Repository<Material>;
    /** 默认上传目录 */
    private readonly defaultUploadDir: string;
    /** 基础URL */
    private readonly baseUrl: string;

    /**
     * 构造函数
     */
    constructor() {
        this.materialRepository = AppDataSource.getRepository(Material);
        this.defaultUploadDir = path.resolve(ENV.UPLOAD_DIR || './uploads');
        this.baseUrl = ENV.API_URL || 'http://localhost:3000';
        
        // 确保上传目录存在
        this.ensureUploadDirExists();
    }

    /**
     * 确保上传目录存在
     */
    private ensureUploadDirExists(): void {
        if (!fs.existsSync(this.defaultUploadDir)) {
            fs.mkdirSync(this.defaultUploadDir, { recursive: true });
        }
    }

    /**
     * 生成唯一文件名
     * @param originalname 原始文件名
     * @returns 生成的唯一文件名
     */
    private generateUniqueFilename(originalname: string): string {
        const timestamp = Date.now();
        const random = nanoid(8);
        const ext = path.extname(originalname);
        return `${timestamp}_${random}${ext}`;
    }

    /**
     * 根据MIME类型确定素材类型
     * @param mimetype MIME类型
     * @returns 素材类型
     */
    private getMaterialTypeFromMimetype(mimetype: string): MaterialType {
        const mimeType = mimetype.toLowerCase();
        
        if (mimeType.startsWith('image/')) {
            return 'image';
        } else if (mimeType.startsWith('audio/')) {
            return 'audio';
        } else if (mimeType.startsWith('video/')) {
            return 'video';
        } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
            return 'document';
        } else if (mimeType === 'text/plain' || mimeType === 'text/html' || mimeType === 'text/markdown') {
            return 'text';
        }
        
        return 'other';
    }

    /**
     * 根据素材类型确定子目录
     * @param type 素材类型
     * @returns 子目录名称
     */
    private getSubDirByType(type: MaterialType): string {
        switch (type) {
            case 'image': return 'images';
            case 'audio': return 'audio';
            case 'video': return 'video';
            case 'document': return 'documents';
            case 'text': return 'texts';
            default: return 'other';
        }
    }

    /**
     * 上传文件
     * @param file 上传的文件
     * @param user 当前用户
     * @param options 上传选项
     * @returns 创建的素材对象
     */
    public async uploadFile(file: Express.Multer.File, user?: any, options?: UploadOptions): Promise<Material> {
        try {
            const type = this.getMaterialTypeFromMimetype(file.mimetype);
            const subDir = this.getSubDirByType(type);
            const destPath = path.join(this.defaultUploadDir, subDir);
            
            // 确保目标目录存在
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            
            // 生成唯一文件名
            const filename = this.generateUniqueFilename(file.originalname);
            const filePath = path.join(destPath, filename);
            
            // 创建可写流
            const writeStream = fs.createWriteStream(filePath);
            
            // 将文件内容写入流
            await new Promise<void>((resolve, reject) => {
                const readStream = fs.createReadStream(file.path);
                readStream.pipe(writeStream);
                
                writeStream.on('finish', () => {
                    // 删除临时文件
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('删除临时文件失败:', err);
                    });
                    
                    resolve();
                });
                
                writeStream.on('error', (err) => {
                    reject(err);
                });
            });
            
            // 计算相对路径
            const relativePath = path.join(subDir, filename).replace(/\\/g, '/');
            const url = `${this.baseUrl}/uploads/${relativePath}`;
            
            // 创建素材记录
            const material = new Material();
            material.filename = filename;
            material.originalname = file.originalname;
            material.path = relativePath;
            material.mimetype = file.mimetype;
            material.size = file.size;
            material.type = type;
            material.category = options?.category;
            material.description = options?.description;
            material.is_public = options?.is_public || false;
            material.upload_dir = subDir;
            material.user = user;
            material.tags = options?.tags;
            material.metadata = options?.metadata;
            material.parent_id = options?.parent_id;
            
            // 保存素材记录
            return await this.materialRepository.save(material);
        } catch (error) {
            console.error('上传文件失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '上传文件失败');
        }
    }

    /**
     * 创建文本素材
     * @param options 文本素材选项
     * @param user 当前用户
     * @returns 创建的素材对象
     */
    public async createTextMaterial(options: TextMaterialOptions, user?: any): Promise<Material> {
        try {
            // 创建素材记录
            const material = new Material();
            material.type = 'text';
            material.description = options.content;
            material.size = options.content.length;
            material.category = options.category;
            material.is_public = options.is_public || false;
            material.user = user;
            material.tags = options.tags;
            material.metadata = options.metadata;
            material.parent_id = options.parent_id;
            
            // 保存素材记录
            return await this.materialRepository.save(material);
        } catch (error) {
            console.error('创建文本素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '创建文本素材失败');
        }
    }

    /**
     * 获取素材列表
     * @param page 页码
     * @param limit 每页条数
     * @param filter 过滤条件
     * @param sortBy 排序字段
     * @param sortOrder 排序方向
     * @returns 素材列表和总数
     */
    public async getMaterials(
        page = 1,
        limit = 20,
        filter?: MaterialFilter,
        sortBy: string = 'created_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ) {
        try {
            const queryBuilder = this.materialRepository.createQueryBuilder('material');
            
            // 构建查询条件
            if (filter) {
                if (filter.id) {
                    if (Array.isArray(filter.id)) {
                        queryBuilder.andWhere('material.id IN (:...ids)', { ids: filter.id });
                    } else {
                        queryBuilder.andWhere('material.id = :id', { id: filter.id });
                    }
                }
                
                if (filter.type) {
                    if (Array.isArray(filter.type)) {
                        queryBuilder.andWhere('material.type IN (:...types)', { types: filter.type });
                    } else {
                        queryBuilder.andWhere('material.type = :type', { type: filter.type });
                    }
                }
                
                if (filter.category) {
                    if (Array.isArray(filter.category)) {
                        queryBuilder.andWhere('material.category IN (:...categories)', { categories: filter.category });
                    } else {
                        queryBuilder.andWhere('material.category = :category', { category: filter.category });
                    }
                }
                
                if (filter.tags) {
                    // 注意：这里使用JSON包含查询，具体实现可能因数据库而异
                    if (Array.isArray(filter.tags)) {
                        // 查找包含任一标签的素材
                        const tagConditions = filter.tags.map((tag, index) => {
                            const paramName = `tag${index}`;
                            queryBuilder.setParameter(paramName, tag);
                            return `JSON_CONTAINS(material.tags, '"${tag}"')`;
                        }).join(' OR ');
                        
                        queryBuilder.andWhere(`(${tagConditions})`);
                    } else {
                        queryBuilder.andWhere(`JSON_CONTAINS(material.tags, :tag)`, { tag: `"${filter.tags}"` });
                    }
                }
                
                if (filter.keyword) {
                    queryBuilder.andWhere(
                        '(material.filename LIKE :keyword OR material.originalname LIKE :keyword OR material.description LIKE :keyword)',
                        { keyword: `%${filter.keyword}%` }
                    );
                }
                
                if (filter.is_public !== undefined) {
                    queryBuilder.andWhere('material.is_public = :is_public', { is_public: filter.is_public });
                }
                
                if (filter.parent_id) {
                    queryBuilder.andWhere('material.parent_id = :parentId', { parentId: filter.parent_id });
                }
                
                if (filter.created_after) {
                    queryBuilder.andWhere('material.created_at >= :createdAfter', { createdAfter: filter.created_after });
                }
                
                if (filter.created_before) {
                    queryBuilder.andWhere('material.created_at <= :createdBefore', { createdBefore: filter.created_before });
                }
                
                if (filter.min_size) {
                    queryBuilder.andWhere('material.size >= :minSize', { minSize: filter.min_size });
                }
                
                if (filter.max_size) {
                    queryBuilder.andWhere('material.size <= :maxSize', { maxSize: filter.max_size });
                }
                
                // 自定义过滤条件
                if (filter.custom_filter) {
                    for (const [key, value] of Object.entries(filter.custom_filter)) {
                        if (value !== undefined && value !== null) {
                            queryBuilder.andWhere(`material.${key} = :${key}`, { [key]: value });
                        }
                    }
                }
            }
            
            // 排序
            queryBuilder.orderBy(`material.${sortBy}`, sortOrder);
            
            // 分页
            const [items, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
                
            return { items, total };
        } catch (error) {
            console.error('获取素材列表失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材列表失败');
        }
    }

    /**
     * 获取单个素材
     * @param id 素材ID
     * @returns 素材对象
     */
    public async getMaterialById(id: string): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({ 
                where: { id },
                relations: ['user', 'related_materials']
            });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            return material;
        } catch (error) {
            console.error('获取素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材失败');
        }
    }

    /**
     * 更新素材
     * @param id 素材ID
     * @param updateData 更新数据
     * @returns 更新后的素材对象
     */
    public async updateMaterial(id: string, updateData: Partial<Material>): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({ where: { id } });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            // 更新素材
            Object.assign(material, updateData);
            
            // 保存更新
            return await this.materialRepository.save(material);
        } catch (error) {
            console.error('更新素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '更新素材失败');
        }
    }

    /**
     * 删除素材
     * @param id 素材ID
     * @returns 是否删除成功
     */
    public async deleteMaterial(id: string): Promise<boolean> {
        try {
            const material = await this.materialRepository.findOne({ where: { id } });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            // 如果是文件类型素材，删除文件
            if (material.type !== 'text' && material.path) {
                const filePath = path.join(this.defaultUploadDir, material.path);
                
                if (fs.existsSync(filePath)) {
                    await unlinkAsync(filePath);
                }
            }
            
            // 删除素材记录
            await this.materialRepository.remove(material);
            
            return true;
        } catch (error) {
            console.error('删除素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '删除素材失败');
        }
    }

    /**
     * 批量删除素材
     * @param ids 素材ID数组
     * @returns 删除成功的素材ID数组
     */
    public async batchDeleteMaterials(ids: string[]): Promise<string[]> {
        try {
            const successIds: string[] = [];
            
            for (const id of ids) {
                try {
                    await this.deleteMaterial(id);
                    successIds.push(id);
                } catch (error) {
                    console.error(`删除素材 ${id} 失败:`, error);
                    // 继续处理下一个
                }
            }
            
            return successIds;
        } catch (error) {
            console.error('批量删除素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '批量删除素材失败');
        }
    }

    /**
     * 获取素材的相关素材
     * @param id 素材ID
     * @returns 相关素材列表
     */
    public async getRelatedMaterials(id: string): Promise<Material[]> {
        try {
            const material = await this.materialRepository.findOne({ 
                where: { id },
                relations: ['related_materials']
            });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            return material.related_materials || [];
        } catch (error) {
            console.error('获取相关素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取相关素材失败');
        }
    }

    /**
     * 获取素材的版本历史
     * @param id 素材ID
     * @returns 版本历史列表
     */
    public async getMaterialVersions(id: string): Promise<Material[]> {
        try {
            // 查找所有以该素材为父素材的记录
            const versions = await this.materialRepository.find({
                where: { parent_id: id },
                order: { created_at: 'DESC' }
            });
            
            return versions;
        } catch (error) {
            console.error('获取素材版本历史失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材版本历史失败');
        }
    }
} 