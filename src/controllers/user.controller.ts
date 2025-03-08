import { Request, Response } from 'express';
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

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

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
            is_active: user.isActive,
            created_at: user.created_at,
            updated_at: user.updated_at,
            roles: user.roles || []
        };
    }

    createUser = async (
        req: Request<{}, ApiResponse<UserResponseDto>, CreateUserDto>,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json({
                code: 0,
                message: '创建用户成功',
                data: this.transformUserToDto(user)
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
                    message: '创建用户失败',
                    error
                });
            }
        }
    };

    updateUser = async (
        req: Request<{ id: string }, ApiResponse<UserResponseDto>, UpdateUserDto>,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json({
                code: 0,
                message: '更新用户成功',
                data: this.transformUserToDto(user)
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
                    message: '更新用户失败',
                    error
                });
            }
        }
    };

    deleteUser = async (
        req: Request<{ id: string }>,
        res: Response<ApiResponse<null>>
    ): Promise<void> => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.json({
                code: 0,
                message: '删除用户成功',
                data: null
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
                    message: '删除用户失败',
                    error
                });
            }
        }
    };

    getUser = async (
        req: Request<{ id: string }>,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        try {
            const user = await this.userService.getUser(req.params.id);
            res.json({
                code: 0,
                message: 'success',
                data: this.transformUserToDto(user)
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
                    message: '获取用户信息失败',
                    error
                });
            }
        }
    };

    getUsers = async (
        req: Request<{}, ApiResponse<UserListResponseDto>, {}, UserQueryDto>,
        res: Response<ApiResponse<UserListResponseDto>>
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
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取用户列表失败',
                    error
                });
            }
        }
    };
} 