import { AppDataSource } from '../config/database';
import { User, UserStatus } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import * as bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const resources = [
    'user',
    'role',
    'permission',
    'sutra',
    'conversation',
    'meditation',
    'worship'
];

const actions = [
    'create',
    'read',
    'update',
    'delete',
    'write'  // 特殊权限，包含创建和更新
];

async function initSuperAdmin() {
    try {
        await AppDataSource.initialize();
        console.log('数据库连接成功');

        // 运行迁移
        await AppDataSource.runMigrations();
        console.log('数据库迁移完成');

        // 1. 创建所有基础权限
        const permissions: Permission[] = [];
        const permissionRepository = AppDataSource.getRepository(Permission);
        
        for (const resource of resources) {
            for (const action of actions) {
                const permissionName = `${resource}:${action}`;
                // 检查权限是否已存在
                let permission = await permissionRepository.findOne({
                    where: { name: permissionName }
                });
                
                if (!permission) {
                    permission = new Permission();
                    permission.id = nanoid(16);
                    permission.name = permissionName;
                    permission.resource = resource;
                    permission.action = action;
                    permission.description = `允许${action}操作${resource}资源`;
                    permission = await permissionRepository.save(permission);
                    console.log(`创建权限: ${permissionName}`);
                } else {
                    console.log(`权限已存在，跳过: ${permissionName}`);
                }
                permissions.push(permission);
            }
        }
        console.log(`共处理 ${permissions.length} 个权限`);

        // 2. 创建超级管理员角色
        const roleRepository = AppDataSource.getRepository(Role);
        let role = await roleRepository.findOne({
            where: { name: 'super_admin' }
        });

        if (!role) {
            role = new Role();
            role.id = nanoid(16);
            role.name = 'super_admin';
            role.description = '超级管理员，拥有所有权限';
            role.permissions = permissions;
            role = await roleRepository.save(role);
            console.log('创建了超级管理员角色');
        } else {
            role.permissions = permissions;
            role = await roleRepository.save(role);
            console.log('更新了超级管理员角色权限');
        }

        // 3. 创建超级管理员用户
        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({
            where: { username: 'super_admin' }
        });

        if (!user) {
            user = userRepository.create({
                id: nanoid(16),
                username: 'super_admin',
                email: 'super_admin@askbudda.com',
                password: 'Admin@123',  // 不需要手动加密，实体的 BeforeInsert 钩子会处理
                status: UserStatus.ACTIVE,
                merit_points: 0,
                meditation_minutes: 0,
                roles: [role]
            });
            await userRepository.save(user);
            console.log('创建了超级管理员用户');
        } else {
            user.roles = [role];
            await userRepository.save(user);
            console.log('更新了超级管理员用户角色');
        }

        console.log('初始化完成！');
        console.log('超级管理员账号：super_admin');
        console.log('超级管理员密码：Admin@123');

    } catch (error) {
        console.error('初始化失败：', error);
    } finally {
        await AppDataSource.destroy();
    }
}

// 运行初始化
initSuperAdmin(); 