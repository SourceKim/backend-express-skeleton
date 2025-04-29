import { Repository, In, Like, DataSource } from 'typeorm';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { customAlphabet } from 'nanoid';
import { Material, MaterialTag, MaterialCategory, MaterialType } from '@/models/material.model';
import { HttpException } from '@/exceptions/http.exception';
import { AppDataSource } from '@/configs/database.config';
import { ENV } from '@/configs/env.config';

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
    /** 数据源 */
    private readonly dataSource: DataSource;
    /** 生成ID的函数 */
    private readonly generateId: () => string;

    /**
     * 构造函数
     */
    constructor() {
        this.materialRepository = AppDataSource.getRepository(Material);
        this.dataSource = AppDataSource;
        this.defaultUploadDir = path.resolve(ENV.UPLOAD_DIR || './uploads');
        this.baseUrl = ENV.API_URL || 'http://localhost:3000';
        // 初始化 nanoid，使用数字和小写字母
        this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
        
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
        const random = this.generateId();
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
            
            // 开始数据库事务
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // 创建素材记录
                const material = new Material();
                material.id = this.generateId();
                material.filename = filename;
                material.originalname = file.originalname;
                material.path = relativePath;
                material.mimetype = file.mimetype;
                material.size = file.size;
                material.type = type;
                material.description = options?.description;
                material.is_public = options?.is_public || false;
                material.upload_dir = subDir;
                material.user = user;
                material.metadata = options?.metadata;
                material.parent_id = options?.parent_id;

                // 处理分类关联
                if (options?.category) {
                    console.log('接收到分类ID:', options.category);
                    const categoryRepository = queryRunner.manager.getRepository(MaterialCategory);
                    
                    // 直接通过ID查找分类
                    let category = await categoryRepository.findOne({
                        where: { id: options.category }
                    });

                    if (category) {
                        console.log('找到对应分类:', category.name);
                        material.materialCategory = category;
                        material.materialCategoryId = category.id;
                        material.category = category.id;
                    } else {
                        console.log('未找到对应分类ID，使用默认分类');
                        // 可以设置一个默认的"未分类"或其他处理方式
                        material.category = options.category; // 保留原始值以便调试
                    }
                }

                // 保存素材基本信息
                const savedMaterial = await queryRunner.manager.save(material);

                // 处理标签关联
                if (options?.tags && options.tags.length > 0) {
                    console.log('接收到标签ID列表:', options.tags);
                    const tagRepository = queryRunner.manager.getRepository(MaterialTag);
                    const materialTags: MaterialTag[] = [];

                    // 批量查询所有标签
                    const foundTags = await tagRepository.find({
                        where: { id: In(options.tags) }
                    });
                    
                    console.log(`已找到${foundTags.length}个标签，总共${options.tags.length}个ID`);
                    
                    // 创建ID到标签对象的映射
                    const tagMap = new Map<string, MaterialTag>();
                    foundTags.forEach(tag => {
                        tagMap.set(tag.id, tag);
                        materialTags.push(tag);
                    });
                    
                    // 记录未找到的标签ID
                    const notFoundTagIds = options.tags.filter(id => !tagMap.has(id));
                    if (notFoundTagIds.length > 0) {
                        console.log('未找到的标签ID:', notFoundTagIds);
                    }

                    // 设置素材的标签关联
                    if (materialTags.length > 0) {
                        savedMaterial.materialTags = materialTags;
                        await queryRunner.manager.save(savedMaterial);
                        console.log('已保存标签关联, 数量:', materialTags.length);
                    }
                }

                // 提交事务
                await queryRunner.commitTransaction();

                // 重新查询完整的素材信息（包含关联）
                const finalMaterial = await this.materialRepository.findOne({
                    where: { id: savedMaterial.id },
                    relations: ['materialCategory', 'materialTags']
                });

                if (!finalMaterial) {
                    throw new HttpException(500, '获取保存的素材失败');
                }

                return finalMaterial;
            } catch (error) {
                // 如果出错，回滚事务
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                // 释放查询运行器
                await queryRunner.release();
            }
        } catch (error) {
            console.error('上传文件失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '上传文件失败');
        }
    }

    /**
     * 获取素材列表
     * @param page 页码
     * @param limit 每页条数
     * @param filter 过滤条件
     * @param sortBy 排序字段
     * @param sortOrder 排序方向
     * @returns 分页后的素材列表
     */
    public async getMaterials(
        page = 1,
        limit = 20,
        filter?: MaterialFilter,
        sortBy: string = 'created_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ) {
        try {
            // 创建查询构建器，确保加载所有需要的关系
            const queryBuilder = this.materialRepository
                .createQueryBuilder('material')
                .leftJoinAndSelect('material.materialCategory', 'materialCategory')
                .leftJoinAndSelect('material.user', 'user')
                .leftJoinAndSelect('material.materialTags', 'materialTags');

            // 应用过滤条件
            if (filter) {
                if (filter.type) {
                    if (Array.isArray(filter.type)) {
                        queryBuilder.andWhere('material.type IN (:...types)', { types: filter.type });
                    } else {
                        queryBuilder.andWhere('material.type = :type', { type: filter.type });
                    }
                }

                if (filter.category) {
                    if (Array.isArray(filter.category)) {
                        queryBuilder.andWhere('materialCategory.id IN (:...categories)', { categories: filter.category });
                    } else {
                        queryBuilder.andWhere('materialCategory.id = :category', { category: filter.category });
                    }
                }

                if (filter.tags) {
                    if (Array.isArray(filter.tags) && filter.tags.length > 0) {
                        // 使用EXISTS子查询查找与指定标签相关联的素材
                        queryBuilder.andWhere(qb => {
                            const subQuery = qb.subQuery()
                                .select('1')
                                .from('material_to_tags', 'mtt')
                                .where('mtt.material_id = material.id')
                                .andWhere('mtt.tag_id IN (:...tagIds)');
                            return 'EXISTS ' + subQuery.getQuery();
                        })
                        .setParameter('tagIds', filter.tags);
                    } else if (!Array.isArray(filter.tags)) {
                        // 单个标签ID
                        queryBuilder.andWhere(qb => {
                            const subQuery = qb.subQuery()
                                .select('1')
                                .from('material_to_tags', 'mtt')
                                .where('mtt.material_id = material.id')
                                .andWhere('mtt.tag_id = :tagId');
                            return 'EXISTS ' + subQuery.getQuery();
                        })
                        .setParameter('tagId', filter.tags);
                    }
                }

                if (filter.keyword) {
                    queryBuilder.andWhere(
                        '(material.originalname LIKE :keyword OR material.description LIKE :keyword)',
                        { keyword: `%${filter.keyword}%` }
                    );
                }

                if (filter.is_public !== undefined) {
                    queryBuilder.andWhere('material.is_public = :isPublic', { isPublic: filter.is_public });
                }

                if (filter.parent_id) {
                    queryBuilder.andWhere('material.parent_id = :parentId', { parentId: filter.parent_id });
                }

                if (filter.min_size) {
                    queryBuilder.andWhere('material.size >= :minSize', { minSize: filter.min_size });
                }

                if (filter.max_size) {
                    queryBuilder.andWhere('material.size <= :maxSize', { maxSize: filter.max_size });
                }

                if (filter.created_after) {
                    queryBuilder.andWhere('material.created_at >= :createdAfter', { createdAfter: filter.created_after });
                }

                if (filter.created_before) {
                    queryBuilder.andWhere('material.created_at <= :createdBefore', { createdBefore: filter.created_before });
                }
            }

            // 应用排序
            if (sortBy && sortOrder) {
                queryBuilder.orderBy(`material.${sortBy}`, sortOrder);
            }

            // 应用分页
            const skip = (page - 1) * limit;
            queryBuilder.skip(skip).take(limit);

            console.log('素材查询SQL:', queryBuilder.getSql());

            // 执行查询，获取结果
            const [items, total] = await queryBuilder.getManyAndCount();

            return {
                items,
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('获取素材列表失败:', error);
            throw new HttpException(500, '获取素材列表失败', error);
        }
    }

    /**
     * 获取单个素材详情
     * @param id 素材ID
     * @returns 素材对象
     */
    public async getMaterialById(id: string): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({ 
                where: { id },
                relations: ['materialCategory', 'user', 'materialTags']
            });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            return material;
        } catch (error) {
            console.error('获取素材详情失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材详情失败');
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
     * 获取素材的版本历史
     * @param id 素材ID
     * @returns 版本历史列表
     */
    public async getMaterialVersions(id: string): Promise<Material[]> {
        try {
            // 查找所有以该素材为父素材的记录
            const versions = await this.materialRepository.find({
                where: { parent_id: id },
                relations: ['materialCategory', 'user', 'materialTags'],
                order: { created_at: 'DESC' }
            });
            
            return versions;
        } catch (error) {
            console.error('获取素材版本历史失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材版本历史失败');
        }
    }

    /**
     * 获取所有分类及其素材数量
     * @returns 分类列表及素材数量
     */
    public async getAllCategories(): Promise<{ name: string; description?: string; count: number }[]> {
        try {
            // 使用原生SQL查询所有不为空的分类及其素材数量
            const categoriesWithCount = await this.materialRepository.query(`
                SELECT 
                    category as name, 
                    COUNT(*) as count
                FROM 
                    materials
                WHERE 
                    category IS NOT NULL 
                    AND category != ''
                GROUP BY 
                    category
                ORDER BY 
                    count DESC, 
                    category ASC
            `);

            return categoriesWithCount;
        } catch (error) {
            console.error('获取所有分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取所有分类失败');
        }
    }

    /**
     * 创建或更新分类（批量更新素材分类）
     * @param oldName 旧分类名称
     * @param newName 新分类名称
     * @param description 分类描述（保存到相应素材的metadata.categoryDescription中）
     * @returns 更新的素材数量和更新后的素材列表
     */
    public async createOrUpdateCategory(oldName: string, newName: string, description?: string): Promise<{ count: number; materials: Material[] }> {
        try {
            if (!newName) {
                throw new HttpException(400, '分类名称不能为空');
            }

            // 查找所有属于旧分类的素材
            const materials = await this.materialRepository.find({
                where: { category: oldName }
            });

            // 批量更新素材的分类
            for (const material of materials) {
                material.category = newName;
                
                // 将分类描述保存到素材的metadata中
                if (description) {
                    if (!material.metadata) {
                        material.metadata = {};
                    }
                    material.metadata.categoryDescription = description;
                }
            }

            // 保存更新
            let updatedMaterials: Material[] = [];
            if (materials.length > 0) {
                updatedMaterials = await this.materialRepository.save(materials);
            }

            return { count: materials.length, materials: updatedMaterials };
        } catch (error) {
            console.error('创建或更新分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '创建或更新分类失败');
        }
    }

    /**
     * 删除分类（清空相应素材的分类字段）
     * @param name 分类名称
     * @returns 更新的素材数量
     */
    public async deleteCategory(name: string): Promise<number> {
        try {
            if (!name) {
                throw new HttpException(400, '分类名称不能为空');
            }

            // 更新所有该分类的素材，将分类设为空字符串
            const result = await this.materialRepository.update(
                { category: name },
                { category: '' }
            );

            return result.affected || 0;
        } catch (error) {
            console.error('删除分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '删除分类失败');
        }
    }

    /**
     * 根据分类和标签获取素材
     * @param category 分类名称
     * @param tags 标签数组
     * @param isPublic 是否公开
     * @param page 页码
     * @param limit 每页条数
     * @param sortBy 排序字段
     * @param sortOrder 排序方向
     * @returns 素材列表和总数
     */
    public async getMaterialsByCategoryAndTags(
        category?: string,
        tags?: string[],
        isPublic?: boolean,
        page = 1,
        limit = 20,
        sortBy: string = 'created_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ) {
        try {
            const queryBuilder = this.materialRepository.createQueryBuilder('material')
                .leftJoinAndSelect('material.materialCategory', 'materialCategory')
                .leftJoinAndSelect('material.user', 'user');
            
            // 构建查询条件
            if (category) {
                queryBuilder.andWhere('materialCategory.name = :category', { category });
            }
            
            if (tags && tags.length > 0) {
                // 查找包含任一标签的素材
                const tagConditions = tags.map((tag, index) => {
                    const paramName = `tag${index}`;
                    queryBuilder.setParameter(paramName, `"${tag}"`);
                    return `JSON_CONTAINS(material.tags, :${paramName})`;
                }).join(' OR ');
                
                queryBuilder.andWhere(`(${tagConditions})`);
            }
            
            if (isPublic !== undefined) {
                queryBuilder.andWhere('material.is_public = :isPublic', { isPublic });
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
            console.error('根据分类和标签获取素材失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '根据分类和标签获取素材失败');
        }
    }

    /**
     * 更新素材标签
     * @param id 标签ID
     * @param name 新的标签名称
     * @param description 新的标签描述
     * @returns 更新后的标签
     */
    public async updateMaterialTag(id: string, name: string, description?: string): Promise<MaterialTag> {
        try {
            // 获取标签仓库
            const materialTagRepository = this.dataSource.getRepository(MaterialTag);

            // 查找指定的标签
            const tag = await materialTagRepository.findOne({
                where: { id }
            });

            if (!tag) {
                throw new HttpException(404, `标签不存在`);
            }

            // 如果更新名称，需要检查是否有同名的标签
            if (name !== tag.name) {
                const existingTag = await materialTagRepository.findOne({
                    where: { name }
                });

                if (existingTag) {
                    throw new HttpException(409, `标签 "${name}" 已存在`);
                }
            }

            // 更新标签
            tag.name = name;
            if (description !== undefined) {
                tag.description = description;
            }

            // 保存更新
            return await materialTagRepository.save(tag);
        } catch (error) {
            console.error('更新标签失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '更新标签失败');
        }
    }

    /**
     * 删除标签（从所有素材中移除指定标签）
     * @param name 标签名称
     * @returns 更新的素材数量和更新后的素材列表
     */
    public async deleteTag(name: string): Promise<{ count: number; materials: Material[] }> {
        try {
            if (!name) {
                throw new HttpException(400, '标签名称不能为空');
            }

            // 查找所有包含该标签的素材
            const materialsWithTag = await this.materialRepository.createQueryBuilder('material')
                .where(`JSON_CONTAINS(material.tags, :tag)`, { tag: `"${name}"` })
                .getMany();

            // 从每个素材中移除标签
            let updatedCount = 0;
            const updatedMaterials: Material[] = [];
            
            for (const material of materialsWithTag) {
                if (material.tags && material.tags.includes(name)) {
                    material.tags = material.tags.filter(tag => tag !== name);
                    updatedCount++;
                    updatedMaterials.push(material);
                }
            }

            // 保存更新
            let savedMaterials: Material[] = [];
            if (updatedMaterials.length > 0) {
                savedMaterials = await this.materialRepository.save(updatedMaterials);
            }

            return { count: updatedCount, materials: savedMaterials };
        } catch (error) {
            console.error('删除标签失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '删除标签失败');
        }
    }

    /**
     * 创建新的素材标签
     * @param name 标签名称
     * @param description 标签描述
     * @returns 创建的标签
     */
    public async createTag(name: string, description?: string): Promise<MaterialTag> {
        try {
            if (!name) {
                throw new HttpException(400, '标签名称不能为空');
            }

            // 获取标签仓库
            const materialTagRepository = this.dataSource.getRepository(MaterialTag);

            // 检查标签是否已存在
            const existingTag = await materialTagRepository.findOne({
                where: { name }
            });

            if (existingTag) {
                throw new HttpException(409, `标签 "${name}" 已存在`);
            }

            // 创建新标签
            const tag = new MaterialTag();
            tag.id = this.generateId();
            tag.name = name;
            tag.description = description;

            // 保存标签
            return await materialTagRepository.save(tag);
        } catch (error) {
            console.error('创建标签失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '创建标签失败');
        }
    }

    /**
     * 创建新的素材分类
     * @param name 分类名称
     * @param description 分类描述
     * @returns 创建的分类
     */
    public async createCategory(name: string, description?: string): Promise<MaterialCategory> {
        try {
            if (!name) {
                throw new HttpException(400, '分类名称不能为空');
            }

            // 获取分类仓库
            const materialCategoryRepository = this.dataSource.getRepository(MaterialCategory);

            // 检查分类是否已存在
            const existingCategory = await materialCategoryRepository.findOne({
                where: { name }
            });

            if (existingCategory) {
                throw new HttpException(409, `分类 "${name}" 已存在`);
            }

            // 创建新分类
            const category = new MaterialCategory();
            category.id = this.generateId();
            category.name = name;
            category.description = description;

            // 保存分类
            return await materialCategoryRepository.save(category);
        } catch (error) {
            console.error('创建分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '创建分类失败');
        }
    }

    /**
     * 更新素材分类
     * @param id 分类ID
     * @param name 新的分类名称
     * @param description 新的分类描述
     * @returns 更新后的分类
     */
    public async updateCategory(id: string, name: string, description?: string): Promise<MaterialCategory> {
        try {
            // 获取分类仓库
            const materialCategoryRepository = this.dataSource.getRepository(MaterialCategory);

            // 查找指定的分类
            const category = await materialCategoryRepository.findOne({
                where: { id }
            });

            if (!category) {
                throw new HttpException(404, `分类不存在`);
            }

            // 如果更新名称，需要检查是否有同名的分类
            if (name !== category.name) {
                const existingCategory = await materialCategoryRepository.findOne({
                    where: { name }
                });

                if (existingCategory) {
                    throw new HttpException(409, `分类 "${name}" 已存在`);
                }
            }

            // 更新分类
            category.name = name;
            if (description !== undefined) {
                category.description = description;
            }

            // 保存更新
            return await materialCategoryRepository.save(category);
        } catch (error) {
            console.error('更新分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '更新分类失败');
        }
    }

    /**
     * 获取所有素材分类及其素材数量
     * @returns 分类列表及素材数量
     */
    public async getAllMaterialCategories(): Promise<MaterialCategory[]> {
        try {
            // 获取分类仓库
            const materialCategoryRepository = this.dataSource.getRepository(MaterialCategory);

            // 查询所有分类
            const categories = await materialCategoryRepository.find();

            // 为每个分类计算素材数量
            for (const category of categories) {
                const count = await this.materialRepository.count({
                    where: { materialCategoryId: category.id }
                });
                (category as any).count = count;
            }

            return categories;
        } catch (error) {
            console.error('获取所有素材分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取所有素材分类失败');
        }
    }

    /**
     * 获取所有素材标签及其素材数量
     * @returns 标签列表及素材数量
     */
    public async getAllMaterialTags(): Promise<MaterialTag[]> {
        try {
            // 获取标签仓库
            const materialTagRepository = this.dataSource.getRepository(MaterialTag);

            // 查询所有标签
            const tags = await materialTagRepository.find();

            // 为每个标签计算素材数量
            for (const tag of tags) {
                const count = await this.dataSource.createQueryBuilder()
                    .select('COUNT(mtt.material_id)', 'count')
                    .from('material_to_tags', 'mtt')
                    .where('mtt.tag_id = :tagId', { tagId: tag.id })
                    .getRawOne();
                
                (tag as any).count = count ? parseInt(count.count) : 0;
            }

            return tags;
        } catch (error) {
            console.error('获取所有素材标签失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '获取所有素材标签失败');
        }
    }

    /**
     * 删除素材分类
     * @param id 分类ID
     * @returns 删除的分类
     */
    public async deleteMaterialCategory(id: string): Promise<MaterialCategory> {
        try {
            // 获取分类仓库
            const materialCategoryRepository = this.dataSource.getRepository(MaterialCategory);

            // 查找指定的分类
            const category = await materialCategoryRepository.findOne({
                where: { id }
            });

            if (!category) {
                throw new HttpException(404, `分类不存在`);
            }

            // 查找使用该分类的素材
            const materialsWithCategory = await this.materialRepository.find({
                where: { materialCategoryId: id }
            });

            // 清除素材的分类关联
            if (materialsWithCategory.length > 0) {
                for (const material of materialsWithCategory) {
                    material.materialCategoryId = undefined;
                    material.materialCategory = undefined;
                }
                await this.materialRepository.save(materialsWithCategory);
            }

            // 删除分类
            await materialCategoryRepository.remove(category);

            return category;
        } catch (error) {
            console.error('删除分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '删除分类失败');
        }
    }

    /**
     * 删除素材标签
     * @param id 标签ID
     * @returns 删除的标签
     */
    public async deleteMaterialTag(id: string): Promise<MaterialTag> {
        try {
            // 获取标签仓库
            const materialTagRepository = this.dataSource.getRepository(MaterialTag);

            // 查找指定的标签
            const tag = await materialTagRepository.findOne({
                where: { id }
            });

            if (!tag) {
                throw new HttpException(404, `标签不存在`);
            }

            // 删除素材-标签关联
            await this.dataSource.createQueryBuilder()
                .delete()
                .from('material_to_tags')
                .where('tag_id = :tagId', { tagId: id })
                .execute();

            // 删除标签
            await materialTagRepository.remove(tag);

            return tag;
        } catch (error) {
            console.error('删除标签失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '删除标签失败');
        }
    }

    /**
     * 根据ID数组获取分类
     * @param ids 分类ID数组
     * @returns 分类数组
     */
    public async getCategoriesByIds(ids: string[]): Promise<MaterialCategory[]> {
        try {
            if (!ids || ids.length === 0) {
                return [];
            }

            // 获取分类仓库
            const materialCategoryRepository = this.dataSource.getRepository(MaterialCategory);

            // 查询指定ID的分类
            const categories = await materialCategoryRepository.find({
                where: { id: In(ids) }
            });

            return categories;
        } catch (error) {
            console.error('根据ID获取分类失败:', error);
            throw error instanceof HttpException ? error : new HttpException(500, '根据ID获取分类失败');
        }
    }
} 