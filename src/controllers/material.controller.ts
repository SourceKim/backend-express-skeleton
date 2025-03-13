import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MaterialService } from '@/services/material.service';
import {
    CreateMaterialDto,
    CreateTextMaterialDto,
    UpdateMaterialDto,
    GetMaterialsQueryDto,
    MaterialDto,
    PaginatedMaterialsResponse,
    BatchDeleteMaterialsDto
} from '@/dtos/material.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto, ApiResponse } from '@/dtos/common.dto';
import { MaterialType } from '@/models/material.model';
import { User } from '@/models/user.model';
import { ENV } from '@/configs/env.config';

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
     * 将Material模型转换为MaterialDto
     */
    private transformToDto(material: any): MaterialDto {
        return {
            id: material.id,
            filename: material.filename,
            originalname: material.originalname,
            path: material.path,
            mimetype: material.mimetype,
            size: material.size,
            type: material.type,
            category: material.category,
            description: material.description,
            is_public: material.is_public,
            upload_dir: material.upload_dir,
            user: material.user ? {
                id: material.user.id,
                username: material.user.username
            } : undefined,
            tags: material.tags,
            metadata: material.metadata,
            parent_id: material.parent_id,
            url: material.path ? `${ENV.API_URL}${ENV.UPLOADS_PATH}/${material.path}` : undefined,
            created_at: material.created_at,
            updated_at: material.updated_at
        };
    }

    /**
     * 上传素材文件
     * POST /api/v1/materials/upload
     */
    public uploadMaterial = async (req: any, res: Response<ApiResponse<MaterialDto>>): Promise<void> => {
        try {
            // 使用multer中间件处理文件上传
            this.upload.single('file')(req, res, async (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            res.status(400).json({
                                code: 400,
                                message: `文件大小超过限制 (${ENV.MAX_FILE_SIZE / 1024 / 1024}MB)`
                            });
                            return;
                        }
                    }
                    res.status(400).json({
                        code: 400,
                        message: '文件上传失败',
                        error: err.message
                    });
                    return;
                }

                if (!req.file) {
                    res.status(400).json({
                        code: 400,
                        message: '未提供文件'
                    });
                    return;
                }

                // 从请求体中获取其他素材信息
                const materialData: CreateMaterialDto = {
                    category: req.body.category,
                    description: req.body.description,
                    is_public: req.body.is_public === 'true',
                    tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
                    metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
                    parent_id: req.body.parent_id
                };

                // 上传文件并创建素材记录
                const material = await this.materialService.uploadFile(req.file, req.user, materialData);

                // 返回创建的素材信息
                res.status(201).json({
                    code: 0,
                    message: '素材上传成功',
                    data: this.transformToDto(material)
                });
            });
        } catch (error) {
            console.error('上传素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '上传素材失败'
            });
        }
    };

    /**
     * 批量上传素材文件
     * POST /api/v1/materials/upload/batch
     */
    public uploadMaterialsBatch = async (req: any, res: Response<ApiResponse<MaterialDto[]>>): Promise<void> => {
        try {
            // 使用multer中间件处理多文件上传
            this.upload.array('files', 10)(req, res, async (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            res.status(400).json({
                                code: 400,
                                message: `文件大小超过限制 (${ENV.MAX_FILE_SIZE / 1024 / 1024}MB)`
                            });
                            return;
                        }
                        if (err.code === 'LIMIT_FILE_COUNT') {
                            res.status(400).json({
                                code: 400,
                                message: '文件数量超过限制'
                            });
                            return;
                        }
                    }
                    res.status(400).json({
                        code: 400,
                        message: '文件上传失败',
                        error: err.message
                    });
                    return;
                }

                if (!req.files || req.files.length === 0) {
                    res.status(400).json({
                        code: 400,
                        message: '未提供文件'
                    });
                    return;
                }

                // 从请求体中获取其他素材信息
                const materialData: CreateMaterialDto = {
                    category: req.body.category,
                    description: req.body.description,
                    is_public: req.body.is_public === 'true',
                    tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
                    metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
                    parent_id: req.body.parent_id
                };

                // 上传所有文件并创建素材记录
                const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
                    this.materialService.uploadFile(file, req.user, materialData)
                );

                const materials = await Promise.all(uploadPromises);

                // 返回创建的素材信息
                res.status(201).json({
                    code: 0,
                    message: '素材批量上传成功',
                    data: materials.map(material => this.transformToDto(material))
                });
            });
        } catch (error) {
            console.error('批量上传素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '批量上传素材失败'
            });
        }
    };

    /**
     * 创建文本素材
     * POST /api/v1/materials/text
     */
    public createTextMaterial = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto>>
    ): Promise<void> => {
        try {
            const materialData: CreateTextMaterialDto = req.body;

            // 创建文本素材
            const material = await this.materialService.createTextMaterial({
                content: materialData.content,
                category: materialData.category,
                is_public: materialData.is_public,
                tags: materialData.tags,
                metadata: materialData.metadata,
                parent_id: materialData.parent_id
            }, req.user);

            // 返回创建的素材信息
            res.status(201).json({
                code: 0,
                message: '文本素材创建成功',
                data: this.transformToDto(material)
            });
        } catch (error) {
            console.error('创建文本素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '创建文本素材失败'
            });
        }
    };

    /**
     * 获取素材列表
     * GET /api/v1/materials
     */
    public getMaterials = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedMaterialsResponse>>
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
            console.error('获取素材列表失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '获取素材列表失败'
            });
        }
    };

    /**
     * 获取素材详情
     * GET /api/v1/materials/:id
     */
    public getMaterialById = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto>>
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
            console.error('获取素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '获取素材失败'
            });
        }
    };

    /**
     * 更新素材
     * PUT /api/v1/materials/admin/:id
     */
    public updateMaterial = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto>>
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
            console.error('更新素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '更新素材失败'
            });
        }
    };

    /**
     * 删除素材
     * DELETE /api/v1/materials/admin/:id
     */
    public deleteMaterial = async (
        req: Request, 
        res: Response<ApiResponse<void>>
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
            console.error('删除素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '删除素材失败'
            });
        }
    };

    /**
     * 批量删除素材
     * POST /api/v1/materials/admin/batch/delete
     */
    public batchDeleteMaterials = async (
        req: Request, 
        res: Response<ApiResponse<{ success_count: number; failed_count: number; success_ids: string[]; failed_ids: string[] }>>
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
            console.error('批量删除素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '批量删除素材失败'
            });
        }
    };

    /**
     * 获取相关素材
     * GET /api/v1/materials/:id/related
     */
    public getRelatedMaterials = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto[]>>
    ): Promise<void> => {
        try {
            const id = req.params.id;
            
            // 获取相关素材
            const materials = await this.materialService.getRelatedMaterials(id);
            
            // 返回相关素材列表
            res.status(200).json({
                code: 0,
                message: '获取相关素材成功',
                data: materials.map(material => this.transformToDto(material))
            });
        } catch (error) {
            console.error('获取相关素材失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '获取相关素材失败'
            });
        }
    };

    /**
     * 获取素材版本历史
     * GET /api/v1/materials/:id/versions
     */
    public getMaterialVersions = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDto[]>>
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
            console.error('获取素材版本历史失败:', error);
            res.status(error instanceof HttpException ? error.status : 500).json({
                code: error instanceof HttpException ? error.status : 500,
                message: error instanceof HttpException ? error.message : '获取素材版本历史失败'
            });
        }
    };
} 