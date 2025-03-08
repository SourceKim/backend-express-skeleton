import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new OrderController();

// 所有订单API都需要认证
router.use(authMiddleware);

// 订单路由
router.post('/', controller.createOrder);
router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.put('/:id/status', controller.updateOrderStatus);

export default router; 