import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new ProductController();

// 公开 API - 不需要认证
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);

// 分类公开 API
router.get('/categories', controller.getCategories);
router.get('/categories/:id', controller.getCategoryById);

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
// 产品管理
router.post('/admin/products', controller.createProduct);
router.put('/admin/products/:id', controller.updateProduct);
router.delete('/admin/products/:id', controller.deleteProduct);

// 分类管理
router.post('/admin/categories', controller.createCategory);
router.put('/admin/categories/:id', controller.updateCategory);
router.delete('/admin/categories/:id', controller.deleteCategory);

export default router; 