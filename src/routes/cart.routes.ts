import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';

const router = Router();
const cartController = new CartController();

// 用户端 API
router.get('/user/cart', authMiddleware, cartController.getUserCart);
router.post('/user/cart/items', authMiddleware, cartController.addCartItem);
router.put('/user/cart/items/:id', authMiddleware, cartController.updateCartItem);
router.delete('/user/cart/items/:id', authMiddleware, cartController.removeCartItem);
router.post('/user/cart/clear', authMiddleware, cartController.clearCart);

// 管理端 API
router.get('/admin/carts', authMiddleware, roleMiddleware(['admin']), cartController.getAllCarts);

export default router; 