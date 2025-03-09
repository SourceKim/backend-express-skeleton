import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new ProductController();

// 公开API - 不需要认证
router.get('/', controller.getProducts);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getProductById);

// 管理员产品路由
// 注意：这里使用 /admin 前缀，并添加认证和管理员中间件
router.use('/admin', authMiddleware, adminMiddleware);
router.post('/admin', controller.createProduct); // 创建产品
router.put('/admin/:id', controller.updateProduct); // 更新产品
router.delete('/admin/:id', controller.deleteProduct); // 删除产品

export default router; 