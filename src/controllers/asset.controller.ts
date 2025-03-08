import { Request as ExpressRequest, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AssetService } from '@/services/asset.service';
import {
    CreateAssetDto,
    UpdateAssetDto,
    GetAssetsQueryDto,
    AssetDto,
    PaginatedAssetsResponse,
    ApiResponse
} from '@/dtos/asset.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { AssetType } from '@/models/asset.model';
import { User } from '@/models/user.model';

// 扩展 Express 的 Request 接口
interface Request extends ExpressRequest {
    user?: User;
    file?: Express.Multer.File;
}

export class AssetController {
    private assetService = new AssetService();
    private uploadDir: string;
    private upload: multer.Multer;

    constructor() {
        // 使用环境变量中配置的上传目录，默认为 ./uploads
        this.uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
        this.ensureUploadDirExists();
        this.upload = multer({ storage: this.storage });
    }

    private ensureUploadDirExists() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * 生成唯一文件名
     */
    private generateUniqueFilename(originalname: string): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const ext = path.extname(originalname);
        return `${timestamp}_${random}${ext}`;
    }

    /**
     * 配置文件存储
     */
    private storage = multer.diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            // 根据文件类型确定子目录
            let subDir = 'other';
            const mimeType = file.mimetype.toLowerCase();
            
            if (mimeType.startsWith('image/')) {
                subDir = 'images';
            } else if (mimeType.startsWith('audio/')) {
                subDir = 'audio';
            } else if (mimeType.startsWith('video/')) {
                subDir = 'video';
            } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
                subDir = 'documents';
            }
            
            const destPath = path.join(this.uploadDir, subDir);
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            
            cb(null, destPath);
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            // 生成唯一文件名
            const uniqueFilename = this.generateUniqueFilename(file.originalname);
            cb(null, uniqueFilename);
        }
    });

    /**
     * 将Asset模型转换为AssetDto
     */
    private transformToDto(asset: any): AssetDto {
        return {
            id: asset.id,
            filename: asset.filename,
            originalname: asset.originalname,
            path: asset.path,
            mimetype: asset.mimetype,
            size: asset.size,
            type: asset.type,
            category: asset.category,
            description: asset.description,
            is_public: asset.is_public,
            upload_dir: asset.upload_dir,
            user_id: asset.user_id,
            url: this.assetService.getAssetUrl(asset),
            created_at: asset.created_at,
            updated_at: asset.updated_at
        };
    }

    /**
     * 获取资源列表
     */
    public getAssets = async (req: Request, res: Response<ApiResponse<PaginatedAssetsResponse>>): Promise<void> => {
        try {
            const pagination = PaginationQueryDto.fromRequest(req.query);
            
            // 调试日志
            console.log('请求参数:', {
                originalQuery: req.query,
                pagination,
                type: req.query.type,
                category: req.query.category,
                keyword: req.query.keyword,
                is_public: req.query.is_public,
                user_id: req.query.user_id
            });

            // 修复 isPublic 参数处理
            let isPublicValue: boolean | undefined = undefined;
            if (req.query.is_public !== undefined) {
                isPublicValue = req.query.is_public === 'true';
            }
            
            // 使用类型安全的方式处理查询参数
            const query: GetAssetsQueryDto = {
                ...pagination,
                type: req.query.type ? this.validateAssetType(req.query.type.toString()) : undefined,
                category: req.query.category ? req.query.category.toString() : undefined,
                keyword: req.query.keyword ? req.query.keyword.toString() : undefined,
                is_public: isPublicValue,
                user_id: req.query.user_id ? req.query.user_id.toString() : undefined
            };

            // 调试日志
            console.log('处理后的查询参数:', query);

            const result = await this.assetService.getAssets(
                query.page,
                query.limit,
                query.type,
                query.category,
                query.keyword,
                query.is_public,
                query.user_id
            );
            
            // 调试日志
            console.log('查询结果:', {
                itemsCount: result.items.length,
                total: result.total
            });
            
            const response: PaginatedAssetsResponse = {
                items: result.items.map(item => this.transformToDto(item)),
                total: result.total,
                page: query.page,
                limit: query.limit,
                total_pages: Math.ceil(result.total / query.limit)
            };
            
            res.json({
                code: 0,
                message: 'success',
                data: response
            });
        } catch (error) {
            console.error('获取资源列表出错:', error);
            res.status(500).json({
                code: 500,
                message: '获取资源列表失败',
                error
            });
        }
    };

    /**
     * 获取资源详情
     */
    public getAssetById = async (req: Request, res: Response<ApiResponse<AssetDto>>): Promise<void> => {
        try {
            const { id } = req.params;
            const asset = await this.assetService.getAssetById(id);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.transformToDto(asset)
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取资源详情失败',
                    error
                });
            }
        }
    };

    /**
     * 上传文件并创建资源记录
     */
    public uploadAsset = async (req: Request, res: Response<ApiResponse<AssetDto>>): Promise<void> => {
        this.upload.single('file')(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({
                    code: 400,
                    message: '文件上传失败',
                    error: err
                });
            }
            
            const file = req.file;
            if (!file) {
                return res.status(400).json({
                    code: 400,
                    message: '未找到上传的文件',
                    error: null
                });
            }
            
            try {
                // 确定文件类型
                let type: AssetType = 'other';
                const mimeType = file.mimetype.toLowerCase();
                
                if (mimeType.startsWith('image/')) {
                    type = 'image';
                } else if (mimeType.startsWith('audio/')) {
                    type = 'audio';
                } else if (mimeType.startsWith('video/')) {
                    type = 'video';
                } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
                    type = 'document';
                }
                
                // 从请求中获取用户ID（如果有）
                const user_id = req.user?.id;
                
                // 创建资源记录
                const assetData: CreateAssetDto = {
                    filename: file.filename,
                    originalname: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    type,
                    category: req.body.category,
                    description: req.body.description,
                    is_public: req.body.is_public === 'true',
                    upload_dir: this.uploadDir, // 保存上传目录
                    user_id: user_id // 保存上传用户ID
                };
                
                const asset = await this.assetService.createAsset(assetData);
                
                res.status(201).json({
                    code: 0,
                    message: 'success',
                    data: this.transformToDto(asset)
                });
            } catch (error) {
                res.status(500).json({
                    code: 500,
                    message: '创建资源记录失败',
                    error
                });
            }
        });
    };

    /**
     * 更新资源信息
     */
    public updateAsset = async (req: Request, res: Response<ApiResponse<AssetDto>>): Promise<void> => {
        try {
            const { id } = req.params;
            const assetData: UpdateAssetDto = req.body;
            
            const existingAsset = await this.assetService.getAssetById(id);
            if (!existingAsset) {
                throw new HttpException(404, '资源不存在');
            }
            
            const asset = await this.assetService.updateAsset(id, assetData);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.transformToDto(asset)
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '更新资源失败',
                    error
                });
            }
        }
    };

    /**
     * 删除资源
     */
    public deleteAsset = async (req: Request, res: Response<ApiResponse<void>>): Promise<void> => {
        try {
            const { id } = req.params;
            
            await this.assetService.deleteAsset(id);
            
            res.json({
                code: 0,
                message: 'success',
                data: undefined
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '删除资源失败',
                    error
                });
            }
        }
    };

    // 验证资产类型是否有效
    private validateAssetType(type: string): AssetType | undefined {
        const validTypes = ['image', 'audio', 'video', 'document', 'other'];
        
        if (validTypes.includes(type)) {
            // 使用类型守卫而不是类型断言
            switch (type) {
                case 'image':
                case 'audio':
                case 'video':
                case 'document':
                case 'other':
                    return type;
                default:
                    return undefined;
            }
        }
        
        return undefined;
    }
} 