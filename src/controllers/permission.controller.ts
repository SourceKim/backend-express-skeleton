import { Request, Response } from 'express';
import { PermissionService } from '@/services/permission.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    CreatePermissionDto,
    UpdatePermissionDto,
    CreateRoleDto,
    UpdateRoleDto,
    PermissionResponseDto,
    RoleResponseDto,
    UserRolesResponseDto
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
            const permission = await this.permissionService.findPermissionById(req.params.id);
            if (!permission) {
                throw new HttpException(404, '权限不存在');
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
            const permission = await this.permissionService.createPermission(req.body);
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
            const permission = await this.permissionService.updatePermission(req.params.id, req.body);
            if (!permission) {
                throw new HttpException(404, '权限不存在');
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
            await this.permissionService.deletePermission(req.params.id);
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
                    message: '删除权限失败',
                    error
                });
            }
        }
    }

    // 获取所有角色
    public findAllRoles = async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto[]>>
    ): Promise<void> => {
        try {
            const roles = await this.permissionService.findAllRoles();
            res.json({
                code: 0,
                message: 'success',
                data: roles
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
                    message: '获取角色列表失败',
                    error
                });
            }
        }
    }

    // 根据ID获取角色
    public findRoleById = async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        try {
            const role = await this.permissionService.findRoleById(req.params.id);
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            res.json({
                code: 0,
                message: 'success',
                data: role
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
                    message: '获取角色详情失败',
                    error
                });
            }
        }
    }

    // 创建角色
    public createRole = async (
        req: Request<{}, ApiResponse<RoleResponseDto>, CreateRoleDto>, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        try {
            const role = await this.permissionService.createRole(req.body);
            res.json({
                code: 0,
                message: 'success',
                data: role
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
                    message: '创建角色失败',
                    error
                });
            }
        }
    }

    // 更新角色
    public updateRole = async (
        req: Request<{ id: string }, ApiResponse<RoleResponseDto>, UpdateRoleDto>, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        try {
            const role = await this.permissionService.updateRole(req.params.id, req.body);
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            res.json({
                code: 0,
                message: 'success',
                data: role
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
                    message: '更新角色失败',
                    error
                });
            }
        }
    }

    // 删除角色
    public deleteRole = async (
        req: Request, 
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        try {
            await this.permissionService.deleteRole(req.params.id);
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
                    message: '删除角色失败',
                    error
                });
            }
        }
    }

    // 为角色分配权限
    public assignPermissionsToRole = async (
        req: Request<{ roleId: string }>, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        try {
            const role = await this.permissionService.assignPermissionsToRole(
                req.params.roleId,
                req.body.permissionIds
            );
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            res.json({
                code: 0,
                message: 'success',
                data: role
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
                    message: '分配权限失败',
                    error
                });
            }
        }
    }

    // 为用户分配角色
    public assignRolesToUser = async (
        req: Request<{ userId: string }>, 
        res: Response<ApiResponse<UserRolesResponseDto>>
    ): Promise<void> => {
        try {
            const result = await this.permissionService.assignRolesToUser(
                req.params.userId,
                { roles: req.body.roles }
            );
            res.json({
                code: 0,
                message: 'success',
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
                    message: '分配角色失败',
                    error
                });
            }
        }
    }
} 