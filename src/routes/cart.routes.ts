import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new CartController();

// 所有购物车API都需要认证
router.use(authMiddleware);

// 普通用户购物车路由
router.get('/', controller.getUserCart);
router.post('/', controller.addToCart);
router.put('/:id', controller.updateCart);
router.delete('/:id', controller.removeFromCart);
router.delete('/', controller.clearCart);

// 管理员购物车路由
// 注意：这里使用 /admin 前缀，并添加管理员中间件
router.use('/admin', adminMiddleware);
router.get('/admin', controller.getAllCarts); // 获取所有用户的购物车
router.get('/admin/user/:userId', controller.getUserCartByAdmin); // 获取特定用户的购物车
router.delete('/admin/user/:userId', controller.clearUserCartByAdmin); // 清空特定用户的购物车
router.delete('/admin/:id', controller.removeCartItemByAdmin); // 删除特定购物车项

export default router; 