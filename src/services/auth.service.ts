import { Repository } from 'typeorm';
import { User, UserStatus } from '@/models/user.model';
import { UserSettings } from '@/models/user-settings.model';
import { AppDataSource } from '@/config/database';
import { HttpException } from '@/exceptions/http.exception';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '@/dtos/auth.dto';
import { logDebug, logError } from '@/utils/logger';
import { customAlphabet } from 'nanoid';

export class AuthService {
    private userRepository: Repository<User>;
    private userSettingsRepository: Repository<UserSettings>;
    private dataSource;
    private generateId: () => string;

    constructor() {
        // 根据环境选择数据源
        this.dataSource = process.env.NODE_ENV === 'test' ? AppDataSource : AppDataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.userSettingsRepository = this.dataSource.getRepository(UserSettings);
        // 初始化 nanoid，使用数字和小写字母
        this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
        
    }

    private generateUserId(): string {
        return this.generateId();
    }

    async register(userData: {
        username: string;
        password: string;
        email?: string;
        phone?: string;
    }): Promise<{ user: Partial<User>; access_token: string }> {
        const { username, password, email, phone } = userData;

        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new HttpException(409, '用户名已存在');
        }

        // 生成随机 user id
        const userId = this.generateUserId();

        // 创建新用户
        const user = this.userRepository.create({
            id: userId,
            username,
            password,
            email,
            phone,
            isActive: true
        });

        // 保存用户
        await this.userRepository.save(user);

        // 创建用户设置
        const userSettings = this.userSettingsRepository.create({
            user: user,
            theme: 'light',
            language: 'zh-CN',
            notifications_enabled: true
        });
        await this.userSettingsRepository.save(userSettings);

        // 生成 token
        const accessToken = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            access_token: accessToken
        };
    }

    async login(username: string, password: string): Promise<{ user: Partial<User>; access_token: string }> {
        // 使用 findOne 查找用户，包括密码字段和角色关系
        const user = await this.userRepository.findOne({
            where: { username },
            select: ['id', 'username', 'email', 'phone', 'avatar', 'status', 'bio', 'isActive', 'password'],
            relations: ['roles', 'roles.permissions']
        });
        
        if (!user) {
            throw new HttpException(401, '用户名或密码错误');
        }

        // 使用实体的 comparePassword 方法验证密码
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new HttpException(401, '用户名或密码错误');
        }

        if (!user.isActive) {
            throw new HttpException(403, '账户已被禁用');
        }

        const accessToken = this.generateToken(user);
        
        // 返回用户信息时排除密码
        const userWithoutPassword = this.sanitizeUser(user);

        return { user: userWithoutPassword, access_token: accessToken };
    }

    async getProfile(userId: string): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        return this.sanitizeUser(user);
    }

    private generateToken(user: User): string {
        return jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
    }

    private sanitizeUser(user: User): Partial<User> {
        // 创建一个新对象，只包含我们想要返回的字段
        const sanitizedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            status: user.status,
            bio: user.bio,
            isActive: user.isActive,
            roles: user.roles,  // 包含角色信息
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        return sanitizedUser;
    }
} 