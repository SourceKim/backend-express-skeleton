import { Request, Response, NextFunction } from 'express';
import { RoleService } from '@/services/role.service';
import { ApiResponse, PaginatedResponse, PaginationQueryDto } from '@/dtos/common.dto';
import { 
    CreateRoleDto,
    UpdateRoleDto,
    RoleResponseDto,
    UserRolesResponseDto,
    AssignPermissionsDto,
    AssignRolesDto
} from '@/dtos/role.dto';
import { HttpException } from '@/exceptions/http.exception';

/**
 * 角色控制器
 * 处理角色相关的请求
 */
export class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    /**
     * 获取所有角色
     * GET /api/roles
     */
    public findAllRoles = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<RoleResponseDto>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 从查询参数中获取分页参数
            const query = PaginationQueryDto.fromRequest(req.query);
            
            // 调用服务获取分页数据
            const paginatedRoles = await this.roleService.findAllRoles(
                query.page,
                query.limit,
                query.sort_by,
                query.sort_order
            );
            
            // 返回分页数据
            res.json({
                code: 0,
                message: '获取角色列表成功',
                data: paginatedRoles
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 根据ID获取角色
     * GET /api/roles/:id
     */
    public findRoleById = async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const role = await this.roleService.findRoleById(id);
            
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建角色
     * POST /api/roles
     */
    public createRole = async (
        req: Request<{}, ApiResponse<RoleResponseDto>, CreateRoleDto>, 
        res: Response<ApiResponse<RoleResponseDto>>,
        next: NextFunction
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
            next(error);
        }
    }

    /**
     * 更新角色
     * PUT /api/roles/:id
     */
    public updateRole = async (
        req: Request<{ id: string }, ApiResponse<RoleResponseDto>, UpdateRoleDto>, 
        res: Response<ApiResponse<RoleResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const roleData = req.body;
            const role = await this.roleService.updateRole(id, roleData);
            
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            
            res.json({
                code: 0,
                message: '角色更新成功',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除角色
     * DELETE /api/roles/:id
     */
    public deleteRole = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
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
            next(error);
        }
    }

    /**
     * 为角色分配权限
     * POST /api/roles/:roleId/permissions
     */
    public assignPermissionsToRole = async (
        req: Request<{ roleId: string }, ApiResponse<RoleResponseDto>, AssignPermissionsDto>, 
        res: Response<ApiResponse<RoleResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { roleId } = req.params;
            const data = req.body;
            const role = await this.roleService.assignPermissionsToRole(roleId, data);
            
            if (!role) {
                throw new HttpException(404, '角色不存在');
            }
            
            res.json({
                code: 0,
                message: '权限分配成功',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 为用户分配角色
     * POST /api/roles/users/:userId
     */
    public assignRolesToUser = async (
        req: Request<{ userId: string }, ApiResponse<UserRolesResponseDto>, AssignRolesDto>, 
        res: Response<ApiResponse<UserRolesResponseDto>>,
        next: NextFunction
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
            next(error);
        }
    }
} 