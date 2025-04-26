import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MaterialService } from '@/services/material.service';
import {
    CreateMaterialDto,
    UpdateMaterialDto,
    GetMaterialsQueryDto,
    MaterialDto,
    PaginatedMaterialsResponse,
    BatchDeleteMaterialsDto,
    MaterialTagDto,
    MaterialCategoryDto,
} from '@/dtos/material.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto, ApiResponse, PaginatedResponse } from '@/dtos/common.dto';
import { ENV } from '@/configs/env.config';
import { Material, MaterialTag, MaterialCategory } from '@/models/material.model';

/**
 * 素材控制器
 * 提供素材管理的API接口
 */
export class MaterialController {
    private materialService = new MaterialService();
    private uploadDir: string;
    private upload: multer.Multer;

    /**
     * 构造函数
     */
    constructor() {
        // 使用环境变量中配置的上传目录
        this.uploadDir = path.resolve(ENV.UPLOAD_DIR);
        this.ensureUploadDirExists();
        this.upload = multer({ 
            storage: multer.diskStorage({}),
            limits: {
                fileSize: ENV.MAX_FILE_SIZE // 默认10MB
            }
        });
    }

    /**
     * 确保上传目录存在
     */
    private ensureUploadDirExists(): void {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * 将 Material 实体转换为 DTO
     * @param material Material 实体
     * @returns MaterialDto
     */
    private transformToDto(material: Material): MaterialDto {
        console.log('原始素材数据:', material);

        // 获取分类名称的逻辑
        let categoryName: string | undefined = undefined;
        
        // 1. 首先检查是否有完整的materialCategory对象
        if (material.materialCategory) {
            categoryName = material.materialCategory.name;
        } 
        // 2. 如果没有，但有materialCategoryId，尝试根据ID获取分类
        else if (material.materialCategoryId) {
            // 不能立即查询数据库，先记录ID
            categoryName = material.materialCategoryId;
        }
        // 3. 最后，如果上面都没有，使用旧的category字段（兼容旧数据）
        else if (material.category) {
            categoryName = material.category;
        }

        const dto: MaterialDto = {
            id: material.id,
            filename: material.filename,
            originalname: material.originalname,
            path: material.path,
            mimetype: material.mimetype,
            size: material.size,
            type: material.type,
            category: categoryName,
            description: material.description,
            is_public: material.is_public,
            upload_dir: material.upload_dir,
            metadata: material.metadata,
            tags: material.materialTags?.map((tag: MaterialTag) => tag.name) || [],
            created_at: material.created_at,
            updated_at: material.updated_at
        };

        // 添加URL
        if (material.path) {
            dto.url = `${ENV.API_URL}/uploads/${material.path}`;
        }

        // 如果有用户信息，添加用户信息
        if (material.user) {
            dto.user = {
                id: material.user.id,
                username: material.user.username
            };
        }

        console.log('转换后的 DTO:', dto);
        return dto;
    }

    /**
     * 上传素材文件
     * POST /api/v1/materials/upload
     */
    public uploadMaterial = async (req: any, res: Response<ApiResponse<MaterialDto>>, next: NextFunction): Promise<void> => {
        try {
            // 使用multer中间件处理文件上传
            this.upload.single('file[0][raw]')(req, res, async (err) => {
                try {
                    if (err) {
                        console.log('上传错误', err);
                        if (err instanceof multer.MulterError) {
                            if (err.code === 'LIMIT_FILE_SIZE') {
                                throw new HttpException(400, `文件大小超过限制 (${ENV.MAX_FILE_SIZE / 1024 / 1024}MB)`);
                            }
                        }
                        throw new HttpException(400, '文件上传失败', err.message);
                    }

                    if (!req.file) {
                        throw new HttpException(400, '未提供文件');
                    }

                    // 从请求体中获取其他素材信息
                    const materialData: CreateMaterialDto = {
                        category: req.body.category,
                        description: req.body.description,
                        is_public: req.body.is_public ? req.body.is_public === 'true' : undefined,
                        tags: req.body.tags ? (typeof req.body.tags === 'string' ? 
                            (req.body.tags.startsWith('[') ? JSON.parse(req.body.tags) : [req.body.tags]) : 
                            req.body.tags) : undefined,
                        metadata: req.body.metadata ? (typeof req.body.metadata === 'string' ? 
                            JSON.parse(req.body.metadata) : req.body.metadata) : undefined,
                    };

                    console.log('materialData', materialData);

                    // 上传文件并创建素材记录
                    const material = await this.materialService.uploadFile(req.file, req.user, materialData);

                    // 返回创建的素材信息
                    res.status(201).json({
                        code: 0,
                        message: '素材上传成功',
                        data: this.transformToDto(material)
                    });
                } catch (error) {
                    next(error);
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材列表
     * GET /api/v1/materials
     */
    public getMaterials = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedMaterialsResponse>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const query: GetMaterialsQueryDto = req.query as any;
            
            // 解析查询参数
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 20;
            const sort_by = query.sort_by || 'created_at';
            const sort_order = (query.sort_order as 'ASC' | 'DESC') || 'DESC';
            
            // 构建过滤条件
            const filter: any = {};
            
            if (query.type) {
                filter.type = query.type;
            }
            
            if (query.category) {
                filter.category = query.category;
            }
            
            if (query.keyword) {
                filter.keyword = query.keyword;
            }
            
            if (query.is_public !== undefined) {
                filter.is_public = query.is_public;
            }
            
            if (query.tags) {
                filter.tags = Array.isArray(query.tags) ? query.tags : [query.tags];
            }
            
            if (query.parent_id) {
                filter.parent_id = query.parent_id;
            }
            
            if (query.min_size) {
                filter.min_size = query.min_size;
            }
            
            if (query.max_size) {
                filter.max_size = query.max_size;
            }
            
            // 获取素材列表
            const { items, total } = await this.materialService.getMaterials(
                page,
                limit,
                filter,
                sort_by,
                sort_order
            );
            
            // 获取所有涉及到的分类ID
            const categoryIds = items
                .map(item => {
                    if (item.materialCategoryId) return item.materialCategoryId;
                    if (item.category && !item.materialCategory) return item.category;
                    return null;
                })
                .filter(id => id !== null) as string[];
            
            // 如果有需要查询的分类ID
            if (categoryIds.length > 0) {
                const uniqueCategoryIds = [...new Set(categoryIds)];
                const categories = await this.materialService.getCategoriesByIds(uniqueCategoryIds);
                
                // 创建分类ID到名称的映射
                const categoryMap = new Map<string, string>();
                categories.forEach((cat: MaterialCategory) => {
                    categoryMap.set(cat.id, cat.name);
                });
                
                // 为没有完整分类对象的素材补充分类名称
                items.forEach(item => {
                    if (!item.materialCategory && (item.materialCategoryId || item.category)) {
                        const categoryId = item.materialCategoryId || item.category;
                        if (categoryId && categoryMap.has(categoryId)) {
                            item.materialCategory = {
                                id: categoryId,
                                name: categoryMap.get(categoryId)!
                            } as MaterialCategory;
                        }
                    }
                });
            }
            
            // 返回素材列表
            const response: PaginatedMaterialsResponse = {
                items: items.map(item => this.transformToDto(item)),
                meta: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    sort_by,
                    sort_order
                }
            };
            
            res.status(200).json({
                code: 0,
                message: '获取素材列表成功',
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材详情
     * GET /api/v1/materials/:id
     */
    public getMaterialById = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 获取素材
            const material = await this.materialService.getMaterialById(id);
            
            // 返回素材信息
            res.status(200).json({
                code: 0,
                message: '获取素材成功',
                data: this.transformToDto(material)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新素材
     * PUT /api/v1/materials/admin/:id
     */
    public updateMaterial = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            const updateData: UpdateMaterialDto = req.body;
            
            // 更新素材
            const material = await this.materialService.updateMaterial(id, updateData);
            
            // 返回更新后的素材信息
            res.status(200).json({
                code: 0,
                message: '素材更新成功',
                data: this.transformToDto(material)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除素材
     * DELETE /api/v1/materials/admin/:id
     */
    public deleteMaterial = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 删除素材
            await this.materialService.deleteMaterial(id);
            
            // 返回成功信息
            res.status(200).json({
                code: 0,
                message: '素材删除成功'
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 批量删除素材
     * POST /api/v1/materials/admin/batch/delete
     */
    public batchDeleteMaterials = async (
        req: Request, 
        res: Response<ApiResponse<{ success_count: number; failed_count: number; success_ids: string[]; failed_ids: string[] }>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { ids }: BatchDeleteMaterialsDto = req.body;
            
            // 批量删除素材
            const successIds = await this.materialService.batchDeleteMaterials(ids);
            
            // 返回成功信息
            res.status(200).json({
                code: 0,
                message: `成功删除 ${successIds.length} 个素材，失败 ${ids.length - successIds.length} 个`,
                data: {
                    success_count: successIds.length,
                    failed_count: ids.length - successIds.length,
                    success_ids: successIds,
                    failed_ids: ids.filter(id => !successIds.includes(id))
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材版本历史
     * GET /api/v1/materials/:id/versions
     */
    public getMaterialVersions = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto[]>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 获取版本历史
            const versions = await this.materialService.getMaterialVersions(id);
            
            // 返回版本历史列表
            res.status(200).json({
                code: 0,
                message: '获取素材版本历史成功',
                data: versions.map(version => this.transformToDto(version))
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材分类列表
     * GET /api/v1/materials/admin/categories
     */
    public getCategories = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialCategoryDto>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 获取所有分类及数量
            const categories = await this.materialService.getAllMaterialCategories();
            
            // 返回分类列表
            res.status(200).json({
                code: 0,
                message: '获取分类列表成功',
                data: {
                    items: categories.map(category => ({
                        id: category.id,
                        name: category.name,
                        description: category.description,
                        created_at: category.created_at,
                        updated_at: category.updated_at,
                        count: (category as any).count || 0
                    })),
                    meta: {
                        total: categories.length,
                        page: 1,
                        limit: categories.length,
                        pages: 1
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 创建分类
     * POST /api/v1/materials/admin/categories
     */
    public createCategory = async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, description } = req.body as MaterialCategoryDto;
            
            if (!name) {
                throw new HttpException(400, '分类名称不能为空');
            }
            
            // 创建分类
            const category = await this.materialService.createCategory(name, description);
            
            // 返回创建的分类
            res.status(201).json({
                code: 0,
                message: '创建分类成功',
                data: {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    created_at: category.created_at,
                    updated_at: category.updated_at,
                    count: 0 // 新创建的分类，素材数量为0
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新分类
     * PUT /api/v1/materials/admin/categories/:id
     */
    public updateCategory = async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            const { name, description } = req.body as MaterialCategoryDto;
            
            if (!name) {
                throw new HttpException(400, '分类名称不能为空');
            }
            
            // 更新分类
            const category = await this.materialService.updateCategory(id, name, description);
            
            // 返回更新后的分类
            res.status(200).json({
                code: 0,
                message: '更新分类成功',
                data: {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    created_at: category.created_at,
                    updated_at: category.updated_at
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除分类
     * DELETE /api/v1/materials/admin/categories/:id
     */
    public deleteCategory = async (
        req: Request,
        res: Response<ApiResponse<{ id: string; name: string }>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 删除分类
            const deletedCategory = await this.materialService.deleteMaterialCategory(id);
            
            // 返回删除的分类信息
            res.status(200).json({
                code: 0,
                message: '删除分类成功',
                data: { 
                    id: deletedCategory.id,
                    name: deletedCategory.name
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材标签列表
     * GET /api/v1/materials/admin/tags
     */
    public getTags = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialTagDto>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 获取所有标签及数量
            const tags = await this.materialService.getAllMaterialTags();
            
            // 返回标签列表
            res.status(200).json({
                code: 0,
                message: '获取标签列表成功',
                data: {
                    items: tags.map(tag => ({
                        id: tag.id,
                        name: tag.name,
                        description: tag.description,
                        created_at: tag.created_at,
                        updated_at: tag.updated_at,
                        count: (tag as any).count || 0
                    })),
                    meta: {
                        total: tags.length,
                        page: 1,
                        limit: tags.length,
                        pages: 1
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 根据分类和标签获取素材
     * GET /api/v1/materials/filter
     */
    public getMaterialsByCategoryAndTags = async (
        req: Request,
        res: Response<ApiResponse<PaginatedMaterialsResponse>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const query = req.query as any;
            
            // 解析查询参数
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 20;
            const sort_by = query.sort_by || 'created_at';
            const sort_order = (query.sort_order as 'ASC' | 'DESC') || 'DESC';
            const category = query.category as string;
            const tags = query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) as string[] : undefined;
            const is_public = query.is_public !== undefined ? query.is_public === 'true' : undefined;
            
            // 获取素材列表
            const { items, total } = await this.materialService.getMaterialsByCategoryAndTags(
                category,
                tags,
                is_public,
                page,
                limit,
                sort_by,
                sort_order
            );
            
            // 返回素材列表
            const response: PaginatedMaterialsResponse = {
                items: items.map(item => this.transformToDto(item)),
                meta: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    sort_by,
                    sort_order
                }
            };
            
            res.status(200).json({
                code: 0,
                message: '获取素材列表成功',
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 创建新标签
     * POST /api/v1/materials/admin/tags
     */
    public createTag = async (
        req: Request,
        res: Response<ApiResponse<MaterialTagDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, description } = req.body as MaterialTagDto;
            
            if (!name) {
                throw new HttpException(400, '标签名称不能为空');
            }
            
            // 检查标签是否已存在
            const existingTags = await this.materialService.getAllMaterialTags();
            if (existingTags.some(tag => tag.name === name)) {
                throw new HttpException(409, `标签 "${name}" 已存在`);
            }
            
            // 创建新标签
            const tag = await this.materialService.createTag(name, description);
            
            res.status(201).json({
                code: 0,
                message: '创建标签成功',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新标签
     * PUT /api/v1/materials/admin/tags/:id
     */
    public updateTag = async (
        req: Request,
        res: Response<ApiResponse<MaterialTagDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            const { name, description } = req.body as MaterialTagDto;
            
            if (!name) {
                throw new HttpException(400, '新标签名称不能为空');
            }
            
            // 更新标签
            const tag = await this.materialService.updateMaterialTag(id, name, description);
            
            res.status(200).json({
                code: 0,
                message: '更新标签成功',
                data: {
                    id: tag.id,
                    name: tag.name,
                    description: tag.description,
                    created_at: tag.created_at,
                    updated_at: tag.updated_at
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除标签
     * DELETE /api/v1/materials/admin/tags/:id
     */
    public deleteTag = async (
        req: Request,
        res: Response<ApiResponse<{ id: string; name: string }>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 删除标签
            const deletedTag = await this.materialService.deleteMaterialTag(id);
            
            res.status(200).json({
                code: 0,
                message: '删除标签成功',
                data: {
                    id: deletedTag.id,
                    name: deletedTag.name
                }
            });
        } catch (error) {
            next(error);
        }
    };
} 