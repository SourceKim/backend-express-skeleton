import { Request, Response } from 'express';
import { SutraService } from '@/services/sutra.service';
import { 
    CreateSutraDto, 
    UpdateSutraDto, 
    GetSutrasQueryDto,
    SutraDto,
    PaginatedSutrasResponse,
    ApiResponse
} from '@/dtos/sutra.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/dtos/common.dto';

export class SutraController {
    private sutraService = new SutraService();

    /**
     * 将Sutra模型转换为SutraDto
     */
    private transformToDto(sutra: any): SutraDto {
        return {
            id: sutra.id,
            title: sutra.title,
            description: sutra.description,
            content: sutra.content,
            category: sutra.category,
            read_count: sutra.read_count,
            created_at: sutra.created_at,
            updated_at: sutra.updated_at
        };
    }

    /**
     * 获取佛经列表
     */
    public getSutras = async (req: Request, res: Response<ApiResponse<PaginatedSutrasResponse>>): Promise<void> => {
        try {
            const pagination = PaginationQueryDto.fromRequest(req.query);
            const query: GetSutrasQueryDto = {
                ...pagination,
                category: req.query.category as string,
                keyword: req.query.keyword as string
            };

            const result = await this.sutraService.getSutras(
                query.page,
                query.limit,
                query.category,
                query.keyword
            );
            
            const response: PaginatedSutrasResponse = {
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
            res.status(500).json({
                code: 500,
                message: '获取佛经列表失败',
                error
            });
        }
    };

    /**
     * 获取佛经详情
     */
    public getSutraById = async (req: Request, res: Response<ApiResponse<SutraDto>>): Promise<void> => {
        try {
            const { id } = req.params;
            const sutra = await this.sutraService.getSutraById(id);
            
            if (!sutra) {
                throw new HttpException(404, '佛经不存在');
            }
            
            await this.sutraService.incrementReadCount(id);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.transformToDto(sutra)
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
                    message: '获取佛经详情失败',
                    error
                });
            }
        }
    };

    /**
     * 创建佛经
     */
    public createSutra = async (req: Request, res: Response<ApiResponse<SutraDto>>): Promise<void> => {
        try {
            const sutraData: CreateSutraDto = req.body;
            const sutra = await this.sutraService.createSutra(sutraData);
            
            res.status(201).json({
                code: 0,
                message: 'success',
                data: this.transformToDto(sutra)
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '创建佛经失败',
                error
            });
        }
    };

    /**
     * 更新佛经
     */
    public updateSutra = async (req: Request, res: Response<ApiResponse<SutraDto>>): Promise<void> => {
        try {
            const { id } = req.params;
            const sutraData: UpdateSutraDto = req.body;
            
            const existingSutra = await this.sutraService.getSutraById(id);
            if (!existingSutra) {
                throw new HttpException(404, '佛经不存在');
            }
            
            const sutra = await this.sutraService.updateSutra(id, sutraData);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.transformToDto(sutra)
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
                    message: '更新佛经失败',
                    error
                });
            }
        }
    };

    /**
     * 删除佛经
     */
    public deleteSutra = async (req: Request, res: Response<ApiResponse<void>>): Promise<void> => {
        try {
            const { id } = req.params;
            
            const existingSutra = await this.sutraService.getSutraById(id);
            if (!existingSutra) {
                throw new HttpException(404, '佛经不存在');
            }
            
            await this.sutraService.deleteSutra(id);
            
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
                    message: '删除佛经失败',
                    error
                });
            }
        }
    };
} 