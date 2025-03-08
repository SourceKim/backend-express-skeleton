import { Request, Response } from 'express';
import { RoleService } from '@/services/role.service';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    CreateRoleDto,
    UpdateRoleDto,
    RoleResponseDto,
    UserRolesResponseDto,
    AssignPermissionsDto,
    AssignRolesDto
} from '@/dtos/role.dto';
import { HttpException } from '@/exceptions/http.exception';

export class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    // 获取所有角色
    public findAllRoles = async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto[]>>
    ): Promise<void> => {
        try {
            const roles = await this.roleService.findAllRoles();
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
            const { id } = req.params;
            const role = await this.roleService.findRoleById(id);
            
            if (!role) {
                res.status(404).json({
                    code: 404,
                    message: '角色不存在',
                    data: undefined
                });
                return;
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
            const roleData = req.body;
            const role = await this.roleService.createRole(roleData);
            res.status(201).json({
                code: 0,
                message: '角色创建成功',
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
            const { id } = req.params;
            const roleData = req.body;
            const role = await this.roleService.updateRole(id, roleData);
            
            if (!role) {
                res.status(404).json({
                    code: 404,
                    message: '角色不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: '角色更新成功',
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
            const { id } = req.params;
            await this.roleService.deleteRole(id);
            res.json({
                code: 0,
                message: '角色删除成功',
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
        req: Request<{ roleId: string }, ApiResponse<RoleResponseDto>, AssignPermissionsDto>, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        try {
            const { roleId } = req.params;
            const data = req.body;
            const role = await this.roleService.assignPermissionsToRole(roleId, data);
            
            if (!role) {
                res.status(404).json({
                    code: 404,
                    message: '角色不存在',
                    data: undefined
                });
                return;
            }
            
            res.json({
                code: 0,
                message: '权限分配成功',
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
        req: Request<{ userId: string }, ApiResponse<UserRolesResponseDto>, AssignRolesDto>, 
        res: Response<ApiResponse<UserRolesResponseDto>>
    ): Promise<void> => {
        try {
            const { userId } = req.params;
            const data = req.body;
            const user = await this.roleService.assignRolesToUser(userId, data);
            
            res.json({
                code: 0,
                message: '角色分配成功',
                data: user
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