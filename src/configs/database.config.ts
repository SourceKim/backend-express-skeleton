import { DataSource } from 'typeorm';
import { ENV } from './env.config';

// 实体 models
import { User } from '@/models/user.model';
import { UserSettings } from '@/models/user-settings.model';
import { Permission } from '@/models/permission.model';
import { Role } from '@/models/role.model';
import { Category, Product } from '@/models/product.model';
import { Order } from '@/models/order.model';
import { Cart } from '@/models/cart.model';
import { Material } from '@/models/material.model';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    port: parseInt(ENV.MYSQL_PORT),
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,  // 处理空密码的情况
    database: ENV.MYSQL_DATABASE,
    synchronize: false, // 禁用自动同步以避免数据结构冲突
    logging: true, // 开启数据库查询日志
    entities: [
        User, 
        UserSettings, 
        Permission,
        Role,
        Product,
        Category,
        Order,
        Cart,
        Material
    ],
    migrations: ['migrations/*.ts'],
    subscribers: [],
    charset: 'utf8mb4'
}); 