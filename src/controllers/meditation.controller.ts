import { Request, Response } from 'express';
import { MeditationService } from '@/services/meditation.service';
import { 
    GetMaterialsQueryDto, 
    GetRecordsQueryDto, 
    StartMeditationDto, 
    EndMeditationDto,
    MeditationRecordDto,
    PaginatedMaterialsResponse,
    PaginatedRecordsResponse,
    MeditationMaterialDto,
    CreateMaterialDto,
    UpdateMaterialDto
} from '@/dtos/meditation.dto';
import { ApiResponse, PaginationQueryDto } from '@/dtos/common.dto';
import { HttpException } from '@/exceptions/http.exception';
import { MeditationMaterialType, MeditationStatus } from '@/models/meditation.model';

export class MeditationController {
    private meditationService = new MeditationService();

    /**
     * 将服务层返回的数据转换为 DTO
     */
    private toRecordDto(record: any): MeditationRecordDto {
        return {
            id: record.id,
            userId: record.userId,
            status: record.status,
            startTime: record.startTime,
            endTime: record.endTime,
            duration: record.duration,
            materials: record.materials.map((m: any) => ({
                id: m.id,
                title: m.title,
                type: m.type,
                assetId: m.assetId,
                asset: m.asset ? {
                    id: m.asset.id,
                    path: m.asset.path,
                    mimetype: m.asset.mimetype
                } : null,
                content: m.content
            })),
            created_at: record.created_at || new Date(),
            updated_at: record.updated_at || new Date()
        };
    }

    /**
     * 获取冥想素材列表
     */
    public getMaterials = async (req: Request, res: Response<ApiResponse<PaginatedMaterialsResponse>>): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id;
            const pagination = PaginationQueryDto.fromRequest(req.query);
            const query: GetMaterialsQueryDto = {
                ...pagination,
                type: req.query.type as MeditationMaterialType,
                keyword: req.query.keyword as string
            };

            const result = await this.meditationService.getMaterials(query);
            
            const response: PaginatedMaterialsResponse = {
                items: result.items.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || null,
                    type: item.type,
                    assetId: item.assetId || null,
                    asset: item.asset ? {
                        id: item.asset.id,
                        path: item.asset.path,
                        mimetype: item.asset.mimetype
                    } : null,
                    content: item.content || null,
                    duration: item.duration || null,
                    created_at: item.created_at,
                    updated_at: item.updated_at
                })),
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
            res.status(500).json({
                code: 500,
                message: '获取冥想素材列表失败',
                error
            });
        }
    };

    /**
     * 获取单个冥想素材
     */
    public getMaterialById = async (req: Request, res: Response<ApiResponse<MeditationMaterialDto>>): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.meditationService.getMaterialById(id);
            
            const response: MeditationMaterialDto = {
                id: result.id,
                title: result.title,
                description: result.description,
                type: result.type,
                assetId: result.assetId,
                asset: result.asset ? {
                    id: result.asset.id,
                    path: result.asset.path,
                    mimetype: result.asset.mimetype
                } : null,
                content: result.content,
                duration: result.duration,
                created_at: result.created_at,
                updated_at: result.updated_at
            };

            res.json({
                code: 0,
                message: 'success',
                data: response
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
                    message: '获取冥想素材失败',
                    error
                });
            }
        }
    };

    /**
     * 创建冥想素材
     */
    public createMaterial = async (req: Request, res: Response<ApiResponse<MeditationMaterialDto>>): Promise<void> => {
        try {
            const dto = new CreateMaterialDto();
            Object.assign(dto, req.body);
            
            const result = await this.meditationService.createMaterial(dto);
            
            const response: MeditationMaterialDto = {
                id: result.id,
                title: result.title,
                description: result.description,
                type: result.type,
                assetId: result.assetId,
                asset: result.asset ? {
                    id: result.asset.id,
                    path: result.asset.path,
                    mimetype: result.asset.mimetype
                } : null,
                content: result.content,
                duration: result.duration,
                created_at: result.created_at,
                updated_at: result.updated_at
            };

            res.status(201).json({
                code: 0,
                message: '冥想素材创建成功',
                data: response
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
                    message: '创建冥想素材失败',
                    error
                });
            }
        }
    };

    /**
     * 更新冥想素材
     */
    public updateMaterial = async (req: Request, res: Response<ApiResponse<MeditationMaterialDto>>): Promise<void> => {
        try {
            const id = req.params.id;
            const dto = new UpdateMaterialDto();
            Object.assign(dto, req.body);
            
            const result = await this.meditationService.updateMaterial(id, dto);
            
            const response: MeditationMaterialDto = {
                id: result.id,
                title: result.title,
                description: result.description,
                type: result.type,
                assetId: result.assetId,
                asset: result.asset ? {
                    id: result.asset.id,
                    path: result.asset.path,
                    mimetype: result.asset.mimetype
                } : null,
                content: result.content,
                duration: result.duration,
                created_at: result.created_at,
                updated_at: result.updated_at
            };

            res.json({
                code: 0,
                message: '冥想素材更新成功',
                data: response
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
                    message: '更新冥想素材失败',
                    error
                });
            }
        }
    };

    /**
     * 删除冥想素材
     */
    public deleteMaterial = async (req: Request, res: Response<ApiResponse<{ success: boolean }>>): Promise<void> => {
        try {
            const id = req.params.id;
            const result = await this.meditationService.deleteMaterial(id);
            
            res.json({
                code: 0,
                message: '冥想素材删除成功',
                data: result
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
                    message: '删除冥想素材失败',
                    error
                });
            }
        }
    };

    /**
     * 开始冥想
     */
    public startMeditation = async (req: Request, res: Response<ApiResponse<MeditationRecordDto>>): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id;
            const dto = new StartMeditationDto(
                req.body.materialId,
                req.body.duration
            );
            const result = await this.meditationService.startMeditation(userId, dto);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.toRecordDto(result)
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
                    message: '开始冥想失败',
                    error
                });
            }
        }
    };

    /**
     * 结束冥想
     */
    public endMeditation = async (req: Request, res: Response<ApiResponse<MeditationRecordDto>>): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id;
            const dto = new EndMeditationDto(
                req.body.meditationId,
                req.body.actualDuration,
                req.body.notes
            );
            const result = await this.meditationService.endMeditation(userId, dto);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.toRecordDto(result)
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
                    message: '结束冥想失败',
                    error
                });
            }
        }
    };

    /**
     * 获取冥想记录
     */
    public getRecords = async (req: Request, res: Response<ApiResponse<PaginatedRecordsResponse>>): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id;
            const pagination = PaginationQueryDto.fromRequest(req.query);
            const query: GetRecordsQueryDto = {
                ...pagination,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                status: req.query.status as MeditationStatus
            };

            const result = await this.meditationService.getRecords(userId, query);
            
            const response: PaginatedRecordsResponse = {
                items: result.items.map(item => this.toRecordDto(item)),
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
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取冥想记录失败',
                    error
                });
            }
        }
    };

    /**
     * 获取进行中的冥想
     */
    public getOngoingMeditation = async (req: Request, res: Response<ApiResponse<MeditationRecordDto | null>>): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id;
            const result = await this.meditationService.getOngoingMeditation(userId);
            
            res.json({
                code: 0,
                message: 'success',
                data: result ? this.toRecordDto(result) : null
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
                    message: '获取进行中的冥想失败',
                    error
                });
            }
        }
    };
} 