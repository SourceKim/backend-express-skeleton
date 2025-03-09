import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new OrderController();

// 所有订单API都需要认证
router.use(authMiddleware);

// 普通用户订单路由
router.post('/', controller.createOrder);
router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.put('/:id/status', controller.updateOrderStatus);

// 管理员订单路由
// 注意：这里使用 /admin 前缀，并添加管理员中间件
router.use('/admin', adminMiddleware);
router.get('/admin', controller.getAllOrders); // 获取所有用户的订单
router.get('/admin/filter', controller.filterOrders); // 按条件筛选订单
router.put('/admin/:id', controller.updateOrder); // 更新订单信息
router.delete('/admin/:id', controller.deleteOrder); // 删除订单
router.get('/admin/statistics', controller.getOrderStatistics); // 获取订单统计数据
router.post('/admin/:id/refund', controller.refundOrder); // 订单退款处理

export default router; 