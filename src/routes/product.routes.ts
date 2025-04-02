import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';

const router = Router();
const productController = new ProductController();

// 用户端 API - 产品管理
router.get('/categories', productController.getAllCategories);
router.get('/:id', productController.getProductById);
router.get('', productController.getProducts);

// 管理端 API - 产品管理
router.post('/admin/products', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.createProduct);
router.put('/admin/products/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.updateProduct);
router.delete('/admin/products/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.deleteProduct);

// 管理端 API - 分类管理
router.post('/admin/categories', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.createCategory);
router.put('/admin/categories/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.updateCategory);
router.delete('/admin/categories/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), productController.deleteCategory);

export default router; 