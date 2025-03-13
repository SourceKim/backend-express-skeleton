import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { HttpException } from '@/exceptions/http.exception';
import { ApiResponse } from '@/dtos/common.dto';
import {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto,
    UserQueryDto,
    UserListResponseDto
} from '@/dtos/user.dto';

/**
 * 用户控制器
 * 处理用户相关的请求
 */
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * 将用户实体转换为DTO
     */
    private transformUserToDto(user: any): UserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            nickname: user.nickname,
            avatar: user.avatar,
            bio: user.bio,
            status: user.status,
            created_at: user.created_at,
            updated_at: user.updated_at,
            roles: user.roles || []
        };
    }

    /**
     * 创建用户
     * POST /api/v1/users/admin
     */
    createUser = async (
        req: Request<{}, ApiResponse<UserResponseDto>, CreateUserDto>,
        res: Response<ApiResponse<UserResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json({
                code: 0,
                message: '创建用户成功',
                data: this.transformUserToDto(user)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新用户
     * PUT /api/v1/users/admin/:id 或 PUT /api/v1/users/profile
     */
    updateUser = async (
        req: Request<{ id: string }, ApiResponse<UserResponseDto>, UpdateUserDto>,
        res: Response<ApiResponse<UserResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.id || (req.user?.id as string);
            const user = await this.userService.updateUser(userId, req.body);
            res.json({
                code: 0,
                message: '更新用户成功',
                data: this.transformUserToDto(user)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除用户
     * DELETE /api/v1/users/admin/:id
     */
    deleteUser = async (
        req: Request<{ id: string }>,
        res: Response<ApiResponse<null>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.json({
                code: 0,
                message: '删除用户成功',
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取用户信息
     * GET /api/v1/users/admin/:id 或 GET /api/v1/users/profile
     */
    getUser = async (
        req: Request<{ id: string }>,
        res: Response<ApiResponse<UserResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.id || (req.user?.id as string);
            const user = await this.userService.getUser(userId);
            res.json({
                code: 0,
                message: 'success',
                data: this.transformUserToDto(user)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取用户列表
     * GET /api/v1/users/admin
     */
    getUsers = async (
        req: Request<{}, ApiResponse<UserListResponseDto>, {}, UserQueryDto>,
        res: Response<ApiResponse<UserListResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { users, total } = await this.userService.getUsers(req.query);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            res.json({
                code: 0,
                message: 'success',
                data: {
                    items: users.map(user => this.transformUserToDto(user)),
                    total,
                    page,
                    limit,
                    total_pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    };
} 