import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';

const router = Router();
const productController = new ProductController();

// 用户端 API
router.get('/user/products', productController.getProducts);
router.get('/user/products/:id', productController.getProductById);
router.get('/user/categories', productController.getAllCategories);

// 管理端 API
router.post('/admin/products', authMiddleware, roleMiddleware(['admin']), productController.createProduct);
router.put('/admin/products/:id', authMiddleware, roleMiddleware(['admin']), productController.updateProduct);
router.delete('/admin/products/:id', authMiddleware, roleMiddleware(['admin']), productController.deleteProduct);
router.post('/admin/categories', authMiddleware, roleMiddleware(['admin']), productController.createCategory);
router.put('/admin/categories/:id', authMiddleware, roleMiddleware(['admin']), productController.updateCategory);
router.delete('/admin/categories/:id', authMiddleware, roleMiddleware(['admin']), productController.deleteCategory);

export default router; 