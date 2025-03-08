import { Request, Response } from 'express';
import { PermissionService } from '@/services/permission.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    CreatePermissionDto,
    UpdatePermissionDto,
    PermissionResponseDto
} from '@/dtos/permission.dto';
import { HttpException } from '@/exceptions/http.exception';

export class PermissionController {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    // 获取所有权限
    public findAllPermissions = async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto[]>>
    ): Promise<void> => {
        try {
            const permissions = await this.permissionService.findAllPermissions();
            res.json({
                code: 0,
                message: 'success',
                data: permissions
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
                    message: '获取权限列表失败',
                    error
                });
            }
        }
    }

    // 根据ID获取权限
    public findPermissionById = async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto>>
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const permission = await this.permissionService.findPermissionById(id);
            
            if (!permission) {
                res.status(404).json({
                    code: 404,
                    message: '权限不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: permission
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
                    message: '获取权限详情失败',
                    error
                });
            }
        }
    }

    // 创建权限
    public createPermission = async (
        req: Request<{}, ApiResponse<PermissionResponseDto>, CreatePermissionDto>, 
        res: Response<ApiResponse<PermissionResponseDto>>
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
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '创建权限失败',
                    error
                });
            }
        }
    }

    // 更新权限
    public updatePermission = async (
        req: Request<{ id: string }, ApiResponse<PermissionResponseDto>, UpdatePermissionDto>, 
        res: Response<ApiResponse<PermissionResponseDto>>
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const permissionData = req.body;
            const permission = await this.permissionService.updatePermission(id, permissionData);
            
            if (!permission) {
                res.status(404).json({
                    code: 404,
                    message: '权限不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: '权限更新成功',
                data: permission
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
                    message: '更新权限失败',
                    error
                });
            }
        }
    }

    // 删除权限
    public deletePermission = async (
        req: Request, 
        res: Response<ApiResponse<void>>
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
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '删除权限失败',
                    error
                });
            }
        }
    }
} 