import { Request, Response, NextFunction } from 'express';
import { UserSettingsService } from '@/services/user-settings.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    UserSettingsResponseDto,
    UpdateUserSettingsDto,
    CreateUserSettingsDto
} from '@/dtos/user-settings.dto';
import { HttpException } from '@/exceptions/http.exception';

/**
 * 用户设置控制器
 * 处理用户设置相关的请求
 */
export class UserSettingsController {
    private userSettingsService: UserSettingsService;

    constructor() {
        this.userSettingsService = new UserSettingsService();
    }

    /**
     * 获取用户设置
     * GET /api/v1/profile/settings 或 GET /api/v1/admin/:userId/settings
     */
    public getUserSettings = async (
        req: Request, 
        res: Response<ApiResponse<UserSettingsResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId || (req.user?.id as string);
            const userSettings = await this.userSettingsService.getUserSettings(userId);
            
            if (!userSettings) {
                throw new HttpException(404, '用户设置不存在');
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: userSettings
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建用户设置
     * POST /api/v1/profile/settings 或 POST /api/v1/admin/:userId/settings
     */
    public createUserSettings = async (
        req: Request<{ userId: string }, ApiResponse<UserSettingsResponseDto>, CreateUserSettingsDto>, 
        res: Response<ApiResponse<UserSettingsResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId || (req.user?.id as string);
            const settingsData = req.body;
            const settings = await this.userSettingsService.createUserSettings(userId, settingsData);
            
            res.status(201).json({
                code: 0,
                message: '用户设置创建成功',
                data: settings
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 更新用户设置
     * PUT /api/v1/profile/settings 或 PUT /api/v1/admin/:userId/settings
     */
    public updateUserSettings = async (
        req: Request<{ userId: string }, ApiResponse<UserSettingsResponseDto>, UpdateUserSettingsDto>, 
        res: Response<ApiResponse<UserSettingsResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId || (req.user?.id as string);
            const settingsData = req.body;
            const userSettings = await this.userSettingsService.updateUserSettings(userId, settingsData);
            
            if (!userSettings) {
                throw new HttpException(404, '用户设置不存在');
            }
            
            res.json({
                code: 0,
                message: '用户设置更新成功',
                data: userSettings
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除用户设置
     * DELETE /api/v1/profile/settings 或 DELETE /api/v1/admin/:userId/settings
     */
    public deleteUserSettings = async (
        req: Request<{ userId: string }>, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId || (req.user?.id as string);
            await this.userSettingsService.deleteUserSettings(userId);
            
            res.json({
                code: 0,
                message: '用户设置删除成功',
                data: undefined
            });
        } catch (error) {
            next(error);
        }
    }
} 