import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new OrderController();

// 普通用户 API - 需要认证
router.post('/', authMiddleware, controller.createOrder);
router.get('/', authMiddleware, controller.getOrders);
router.get('/:id', authMiddleware, controller.getOrderById);
router.put('/:id/status', authMiddleware, controller.updateOrderStatus);

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
// 订单管理
router.get('/admin/all', controller.getAllOrders); // 获取所有用户的订单
router.get('/admin/filter', controller.filterOrders); // 按条件筛选订单
router.get('/admin/statistics', controller.getOrderStatistics); // 获取订单统计数据
router.put('/admin/:id', controller.updateOrder); // 更新订单信息
router.delete('/admin/:id', controller.deleteOrder); // 删除订单
router.post('/admin/:id/refund', controller.refundOrder); // 订单退款处理

export default router; 