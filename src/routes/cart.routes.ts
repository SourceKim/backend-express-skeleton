import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new CartController();

// 普通用户 API - 需要认证
router.get('/', authMiddleware, controller.getUserCart);
router.post('/', authMiddleware, controller.addToCart);
router.put('/:id', authMiddleware, controller.updateCart);
router.delete('/:id', authMiddleware, controller.removeFromCart);
router.delete('/', authMiddleware, controller.clearCart);

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin/all', controller.getAllCarts); // 获取所有用户的购物车
router.get('/admin/user/:userId', controller.getUserCartByAdmin); // 获取特定用户的购物车
router.delete('/admin/user/:userId', controller.clearUserCartByAdmin); // 清空特定用户的购物车
router.delete('/admin/:id', controller.removeCartItemByAdmin); // 删除特定购物车项

export default router; 