import { DataSource } from 'typeorm';
import { ENV } from './env.config';

// 实体 models
import { User } from '@/models/user.model';
import { UserSettings } from '@/models/user-settings.model';
import { Permission } from '@/models/permission.model';
import { Role } from '@/models/role.model';
import { Product, ProductCategory } from '@/models/product.model';
import { Order, OrderItem } from '@/models/order.model';
import { Cart, CartItem } from '@/models/cart.model';
import { Material, MaterialCategory, MaterialTag } from '@/models/material.model';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    port: parseInt(ENV.MYSQL_PORT),
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,  // 处理空密码的情况
    database: ENV.MYSQL_DATABASE,
    synchronize: false, // 禁用自动同步以避免数据结构冲突
    logging: true, // 开启数据库查询日志
    extra: {
        decimalNumbers: true
    },
    entities: [
        User, 
        UserSettings, 
        Permission,
        Role,
        Product,
        ProductCategory,
        Order,
        OrderItem,
        Cart,
        CartItem,
        Material,
        MaterialCategory,
        MaterialTag
    ],
    migrations: ['migrations/*.ts'],
    subscribers: [],
    charset: 'utf8mb4'
}); 