import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';

const router = Router();
const cartController = new CartController();

// 用户端 API
router.get('/', authMiddleware, cartController.getUserCart);
router.post('/', authMiddleware, cartController.addCartItem);
router.put('/:id', authMiddleware, cartController.updateCartItem);
router.delete('/:id', authMiddleware, cartController.removeCartItem);
router.post('/clear', authMiddleware, cartController.clearCart);

// 管理端 API
router.get('/admin/carts', authMiddleware, roleMiddleware(['admin', 'super_admin']), cartController.getAllCarts);

export default router; 