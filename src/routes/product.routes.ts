import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new ProductController();

// 公开API
router.get('/', controller.getProducts);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getProductById);

// 需要管理员权限的API
router.post('/', authMiddleware, controller.createProduct);
router.put('/:id', authMiddleware, controller.updateProduct);
router.delete('/:id', authMiddleware, controller.deleteProduct);

export default router; 