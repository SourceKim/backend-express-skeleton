import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new CartController();

// 所有购物车API都需要认证
router.use(authMiddleware);

// 购物车路由
router.get('/', controller.getUserCart);
router.post('/', controller.addToCart);
router.put('/:id', controller.updateCart);
router.delete('/:id', controller.removeFromCart);
router.delete('/', controller.clearCart);

export default router; 