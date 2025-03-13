import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { HttpException } from '@/exceptions/http.exception';
import { ApiResponse } from '@/dtos/common.dto';
import { 
    RegisterDto, 
    LoginDto, 
    RegisterResponseDto, 
    LoginResponseDto, 
    ProfileResponseDto 
} from '@/dtos/auth.dto';
import { logInfo, logError, logDebug } from '@/utils/logger';

/**
 * 认证控制器
 * 处理用户注册、登录和获取个人信息
 */
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        logInfo('AuthController 初始化');
    }

    /**
     * 将用户实体转换为DTO
     */
    private transformUserToDto(user: any): RegisterResponseDto {
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
     * 用户注册
     * POST /api/auth/register
     */
    register = async (
        req: Request<{}, ApiResponse<RegisterResponseDto>, RegisterDto>, 
        res: Response<ApiResponse<RegisterResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { username, password, email, phone, nickname, avatar, bio } = req.body;
            logInfo('用户注册请求', (req as any).requestId, { username, email, phone, nickname });

            // 基本验证
            if (!username || !password) {
                logError('注册参数缺失', (req as any).requestId, { username, password });
                throw new HttpException(400, '用户名和密码不能为空');
            }

            // 用户名格式验证
            if (username.length < 3 || username.length > 20) {
                throw new HttpException(400, '用户名长度必须在3-20个字符之间');
            }

            // 密码强度验证
            if (password.length < 6) {
                throw new HttpException(400, '密码长度不能少于6个字符');
            }

            // 邮箱格式验证
            if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new HttpException(400, '邮箱格式不正确');
            }

            // 手机号格式验证
            if (phone && !phone.match(/^1[3-9]\d{9}$/)) {
                throw new HttpException(400, '手机号格式不正确');
            }

            const result = await this.authService.register({
                username,
                password,
                email,
                phone
                // nickname, avatar, bio 等参数可能 AuthService 中的 register 方法不支持
            });
            
            logInfo('用户注册成功', (req as any).requestId, { userId: result.user.id, username });
            
            res.status(201).json({
                code: 0,
                message: '注册成功',
                data: this.transformUserToDto(result.user)
            });
        } catch (error) {
            logError('用户注册失败', (req as any).requestId, { error, body: req.body });
            next(error);
        }
    };

    /**
     * 用户登录
     * POST /api/auth/login
     */
    login = async (
        req: Request<{}, ApiResponse<LoginResponseDto>, LoginDto>,
        res: Response<ApiResponse<LoginResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { username, password } = req.body;
            logInfo('用户登录请求', (req as any).requestId, { username });

            if (!username || !password) {
                logError('登录参数缺失', (req as any).requestId, { username });
                throw new HttpException(400, '用户名和密码不能为空');
            }

            const result = await this.authService.login(username, password);
            
            logInfo('用户登录成功', (req as any).requestId, { userId: result.user.id, username });
            
            res.json({
                code: 0,
                message: '登录成功',
                data: {
                    access_token: result.access_token,
                    user: this.transformUserToDto(result.user)
                }
            });
        } catch (error) {
            logError('用户登录失败', (req as any).requestId, { error, username: req.body.username });
            next(error);
        }
    };

    /**
     * 获取用户个人信息
     * GET /api/auth/profile
     */
    getProfile = async (
        req: Request<{}, ApiResponse<ProfileResponseDto>, {}>,
        res: Response<ApiResponse<ProfileResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 使用类型断言访问 user
            if (!(req as any).user) {
                throw new HttpException(401, '用户未认证');
            }
            
            const user = await this.authService.getProfile((req as any).user.id);
            
            res.json({
                code: 0,
                message: 'success',
                data: this.transformUserToDto(user)
            });
        } catch (error) {
            next(error);
        }
    };
} 