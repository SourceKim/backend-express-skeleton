import { DataSource } from 'typeorm';
import { User } from '@/models/user.model';
import { UserSettings } from '@/models/user-settings.model';
import { Sutra } from '@/models/sutra.model';
import { Conversation } from '@/models/conversation.model';
import { Chat } from '@/models/chat.model';
import { MeditationMaterial, MeditationRecord } from '@/models/meditation.model';
import { WorshipMaterial, WorshipRecord } from '@/models/worship.model';
import { Permission } from '@/models/permission.model';
import { Role } from '@/models/role.model';
import { Asset } from '@/models/asset.model';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 数据库实体说明：
 * 
 * Permission - 权限实体
 * - id: string (主键)
 * - name: string (权限名称，唯一)
 * - description: string (权限描述)
 * - roles: Role[] (多对多关系，拥有此权限的角色)
 * - created_at: Date (创建时间)
 * - updated_at: Date (更新时间)
 * 
 * Role - 角色实体
 * - id: string (主键)
 * - name: string (角色名称，唯一)
 * - description: string (角色描述)
 * - permissions: Permission[] (多对多关系，角色拥有的权限)
 * - users: User[] (多对多关系，拥有此角色的用户)
 * - created_at: Date (创建时间)
 * - updated_at: Date (更新时间)
 */

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',  // 处理空密码的情况
    database: process.env.MYSQL_DATABASE || 'ask_budda',
    synchronize: false, // 禁用自动同步以避免数据结构冲突
    logging: false, // 关闭数据库查询日志
    entities: [
        User, 
        UserSettings, 
        Sutra, 
        Conversation, 
        Chat, 
        MeditationMaterial, 
        MeditationRecord,
        WorshipMaterial,
        WorshipRecord,
        Permission,
        Role,
        Asset
    ],
    migrations: ['migrations/*.ts'],
    subscribers: [],
    charset: 'utf8mb4'
}); 