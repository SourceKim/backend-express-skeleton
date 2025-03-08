import { Request, Response } from 'express';
import { UserSettingsService } from '../services/user-settings.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    CreateUserSettingsDto,
    UpdateUserSettingsDto,
    UserSettingsResponseDto
} from '../dtos/user-settings.dto';
import { HttpException } from '@/exceptions/http.exception';

export class UserSettingsController {
    private userSettingsService: UserSettingsService;

    constructor() {
        this.userSettingsService = new UserSettingsService();
    }

    // 获取用户设置
    public getUserSettings = async (
        req: Request, 
        res: Response<ApiResponse<UserSettingsResponseDto>>
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            const settings = await this.userSettingsService.getUserSettings(userId);
            
            if (!settings) {
                res.status(404).json({
                    code: 404,
                    message: '用户设置不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: settings
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
                    message: '获取用户设置失败',
                    error
                });
            }
        }
    }

    // 创建用户设置
    public createUserSettings = async (
        req: Request<{ userId: string }, ApiResponse<UserSettingsResponseDto>, CreateUserSettingsDto>, 
        res: Response<ApiResponse<UserSettingsResponseDto>>
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            const settingsData = req.body;
            const settings = await this.userSettingsService.createUserSettings(userId, settingsData);
            
            res.status(201).json({
                code: 0,
                message: '用户设置创建成功',
                data: settings
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
                    message: '创建用户设置失败',
                    error
                });
            }
        }
    }

    // 更新用户设置
    public updateUserSettings = async (
        req: Request<{ userId: string }, ApiResponse<UserSettingsResponseDto>, UpdateUserSettingsDto>, 
        res: Response<ApiResponse<UserSettingsResponseDto>>
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            const settingsData = req.body;
            const settings = await this.userSettingsService.updateUserSettings(userId, settingsData);
            
            if (!settings) {
                res.status(404).json({
                    code: 404,
                    message: '用户设置不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: '用户设置更新成功',
                data: settings
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
                    message: '更新用户设置失败',
                    error
                });
            }
        }
    }

    // 删除用户设置
    public deleteUserSettings = async (
        req: Request<{ userId: string }>, 
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            await this.userSettingsService.deleteUserSettings(userId);
            
            res.json({
                code: 0,
                message: '用户设置删除成功',
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
                    message: '删除用户设置失败',
                    error
                });
            }
        }
    }
} 