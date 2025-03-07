import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { WorshipService } from '@/services/worship.service';
import { HttpException } from '@/exceptions/http.exception';
import {
    GetWorshipMaterialsQueryDto,
    CreateWorshipRecordDto,
    GetWorshipRecordsQueryDto,
    GetWorshipRankingQueryDto,
    CreateWorshipMaterialDto,
    UpdateWorshipMaterialDto,
    UpdateWorshipRecordDto,
    WorshipMaterialResponseDto,
    WorshipRecordResponseDto,
    WorshipRankingResponseDto
} from '@/dtos/worship.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class WorshipController {
    private worshipService: WorshipService;

    constructor() {
        this.worshipService = new WorshipService();
    }

    // 获取上香素材列表
    public getMaterials = async (req: Request, res: Response): Promise<void> => {
        try {
            // 参数验证
            const queryParams = plainToInstance(GetWorshipMaterialsQueryDto, req.query);
            const errors = await validate(queryParams);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            const { type } = queryParams;
            const materials = await this.worshipService.getMaterials(type);

            res.status(200).json({
                code: 0,
                message: '获取上香素材成功',
                data: materials
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 创建上香素材
    public createMaterial = async (req: Request, res: Response): Promise<void> => {
        try {
            const dto = plainToInstance(CreateWorshipMaterialDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            const material = await this.worshipService.createMaterial(dto);

            res.status(201).json({
                code: 0,
                message: '创建上香素材成功',
                data: material
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 获取单个上香素材
    public getMaterialById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const material = await this.worshipService.getMaterialById(id);

            res.status(200).json({
                code: 0,
                message: '获取上香素材成功',
                data: material
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 更新上香素材
    public updateMaterial = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dto = plainToInstance(UpdateWorshipMaterialDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            const material = await this.worshipService.updateMaterial(id, dto);

            res.status(200).json({
                code: 0,
                message: '更新上香素材成功',
                data: material
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 删除上香素材
    public deleteMaterial = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.worshipService.deleteMaterial(id);

            res.status(200).json({
                code: 0,
                message: '删除上香素材成功',
                data: result
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 创建上香记录
    public createRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            // 参数验证
            const dto = plainToInstance(CreateWorshipRecordDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            // 获取用户ID
            const userId = (req as any).user.id;
            const record = await this.worshipService.createRecord(userId, dto);

            res.status(201).json({
                code: 0,
                message: '上香成功',
                data: record
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 获取单个上香记录
    public getRecordById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            const record = await this.worshipService.getRecordById(userId, id);

            res.status(200).json({
                code: 0,
                message: '获取上香记录成功',
                data: record
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 更新上香记录
    public updateRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            const dto = plainToInstance(UpdateWorshipRecordDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            const record = await this.worshipService.updateRecord(userId, id, dto);

            res.status(200).json({
                code: 0,
                message: '更新上香记录成功',
                data: record
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 删除上香记录
    public deleteRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            const result = await this.worshipService.deleteRecord(userId, id);

            res.status(200).json({
                code: 0,
                message: '删除上香记录成功',
                data: result
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 获取上香记录列表
    public getRecords = async (req: Request, res: Response): Promise<void> => {
        try {
            // 参数验证
            const queryParams = plainToInstance(GetWorshipRecordsQueryDto, req.query);
            const errors = await validate(queryParams);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            // 获取用户ID
            const userId = (req as any).user.id;
            const { page = 1, limit = 20 } = queryParams;
            const records = await this.worshipService.getRecords(userId, page, limit);

            res.status(200).json({
                code: 0,
                message: '获取上香记录成功',
                data: records
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }

    // 获取上香排行榜
    public getRanking = async (req: Request, res: Response): Promise<void> => {
        try {
            // 参数验证
            const queryParams = plainToInstance(GetWorshipRankingQueryDto, req.query);
            const errors = await validate(queryParams);
            if (errors.length > 0) {
                res.status(400).json({ code: 400, message: '请求参数错误', data: null });
                return;
            }

            const { limit = 10 } = queryParams;
            const ranking = await this.worshipService.getRanking(limit);

            res.status(200).json({
                code: 0,
                message: '获取上香排行榜成功',
                data: ranking
            });
        } catch (error: any) {
            res.status(error.status || 500).json({
                code: error.status || 500,
                message: error.message || '服务器内部错误',
                data: null
            });
        }
    }
} 