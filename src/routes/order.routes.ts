import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';

const router = Router();
const orderController = new OrderController();

// 用户端 API
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:id', authMiddleware, orderController.getUserOrderById);
router.post('/orders/:id/cancel', authMiddleware, orderController.cancelOrder);

// 管理端 API
router.get('/admin/orders', authMiddleware, roleMiddleware(['super_admin']), orderController.getAllOrders);
router.put('/admin/orders/:id', authMiddleware, roleMiddleware(['super_admin']), orderController.updateOrderStatus);
router.get('/admin/orders/stats', authMiddleware, roleMiddleware(['super_admin']), orderController.getOrderStats);

export default router; 