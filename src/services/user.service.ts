import { Repository } from 'typeorm';
import { User, UserStatus } from '@/models/user.model';
import { Role } from '@/models/role.model';
import { AppDataSource } from '@/config/database';
import { HttpException } from '@/exceptions/http.exception';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '@/dtos/user.dto';
import { nanoid } from 'nanoid';

export class UserService {
    private userRepository: Repository<User>;
    private roleRepository: Repository<Role>;
    private dataSource;

    constructor() {
        this.dataSource = process.env.NODE_ENV === 'test' ? AppDataSource : AppDataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.roleRepository = this.dataSource.getRepository(Role);
    }

    private generateUserId(): string {
        return nanoid(16);
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        const { username, password, roles: roleIds, ...rest } = userData;

        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new HttpException(409, '用户名已存在');
        }

        // 获取角色实体
        let roles: Role[] = [];
        if (roleIds && roleIds.length > 0) {
            roles = await this.roleRepository.findByIds(roleIds);
            if (roles.length !== roleIds.length) {
                throw new HttpException(400, '部分角色ID不存在');
            }
        }

        // 创建新用户
        const user = new User();
        Object.assign(user, {
            id: this.generateUserId(),
            username,
            password,
            ...rest,
            roles,
            status: UserStatus.ACTIVE,
            isActive: true
        });

        // 保存用户
        return await this.userRepository.save(user);
    }

    async updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
        const { roles: roleIds, ...rest } = updateData;

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });
        
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 如果需要更新角色
        if (roleIds) {
            const roles = await this.roleRepository.findByIds(roleIds);
            if (roles.length !== roleIds.length) {
                throw new HttpException(400, '部分角色ID不存在');
            }
            user.roles = roles;
        }

        // 更新其他用户信息
        Object.assign(user, rest);
        
        return await this.userRepository.save(user);
    }

    async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        await this.userRepository.remove(user);
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        return user;
    }

    async getUsers(query: UserQueryDto): Promise<{ users: User[]; total: number }> {
        const {
            page = 1,
            limit = 10,
            username,
            email,
            status,
            is_active
        } = query;

        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions');

        // 添加查询条件
        if (username) {
            queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
        }
        if (email) {
            queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
        }
        if (status) {
            queryBuilder.andWhere('user.status = :status', { status });
        }
        if (is_active !== undefined) {
            queryBuilder.andWhere('user.isActive = :isActive', { isActive: is_active });
        }

        // 分页
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        return { users, total };
    }
} 