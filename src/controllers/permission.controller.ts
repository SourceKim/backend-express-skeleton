import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '@/services/permission.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    CreatePermissionDto,
    UpdatePermissionDto,
    PermissionResponseDto
} from '@/dtos/permission.dto';
import { HttpException } from '@/exceptions/http.exception';

/**
 * 权限控制器
 * 处理权限相关的请求
 */
export class PermissionController {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    /**
     * 获取所有权限
     * GET /api/permissions
     */
    public findAllPermissions = async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto[]>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const permissions = await this.permissionService.findAllPermissions();
            res.json({
                code: 0,
                message: 'success',
                data: permissions
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 根据ID获取权限
     * GET /api/permissions/:id
     */
    public findPermissionById = async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const permission = await this.permissionService.findPermissionById(id);
            
            if (!permission) {
                throw new HttpException(404, '权限不存在');
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建权限
     * POST /api/permissions
     */
    public createPermission = async (
        req: Request<{}, ApiResponse<PermissionResponseDto>, CreatePermissionDto>, 
        res: Response<ApiResponse<PermissionResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const permissionData = req.body;
            const permission = await this.permissionService.createPermission(permissionData);
            res.status(201).json({
                code: 0,
                message: '权限创建成功',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 更新权限
     * PUT /api/permissions/:id
     */
    public updatePermission = async (
        req: Request<{ id: string }, ApiResponse<PermissionResponseDto>, UpdatePermissionDto>, 
        res: Response<ApiResponse<PermissionResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const permissionData = req.body;
            const permission = await this.permissionService.updatePermission(id, permissionData);
            
            if (!permission) {
                throw new HttpException(404, '权限不存在');
            }
            
            res.json({
                code: 0,
                message: '权限更新成功',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除权限
     * DELETE /api/permissions/:id
     */
    public deletePermission = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.permissionService.deletePermission(id);
            res.json({
                code: 0,
                message: '权限删除成功',
                data: undefined
            });
        } catch (error) {
            next(error);
        }
    }
} 