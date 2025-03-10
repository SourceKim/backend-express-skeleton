import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import permissionRoutes from '@/routes/permission.routes';
import roleRoutes from '@/routes/role.routes';
import userRoutes from '@/routes/user.routes';
import userSettingsRoutes from '@/routes/user-settings.routes';
import productRoutes from '@/routes/product.routes';
import cartRoutes from '@/routes/cart.routes';
import orderRoutes from '@/routes/order.routes';
import materialRoutes from '@/routes/material.routes';

const router = Router();

// API 版本控制
const API_VERSION = '/api/v1';

// 注册所有路由
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/permissions`, permissionRoutes);
router.use(`${API_VERSION}/roles`, roleRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}`, userSettingsRoutes); // 用户设置路由

// 商城相关路由
router.use(`${API_VERSION}/products`, productRoutes);
router.use(`${API_VERSION}/cart`, cartRoutes);
router.use(`${API_VERSION}/orders`, orderRoutes);

// 素材管理路由
router.use(`${API_VERSION}/materials`, materialRoutes);

export default router; 