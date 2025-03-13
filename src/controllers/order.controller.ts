import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { OrderService } from '@/services/order.service';
import { CartService } from '@/services/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';
import { ApiResponse } from '@/dtos/common.dto';

/**
 * 订单控制器
 * 处理订单相关的请求
 */
export class OrderController {
  private orderService = new OrderService();
  private cartService = new CartService();

  /**
   * 创建订单
   * POST /api/v1/orders
   */
  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }
      
      // 手动验证请求数据
      const orderDto = plainToClass(CreateOrderDto, req.body);
      const errors = await validate(orderDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      // 获取用户购物车
      const cartItems = await this.cartService.findUserCart(userId);
      
      if (cartItems.length === 0) {
        throw new HttpException(400, '购物车为空，无法创建订单');
      }
      
      // 创建订单
      const order = await this.orderService.createOrder(userId, cartItems, req.body.address);
      
      // 清空购物车
      await this.cartService.clearUserCart(userId);
      
      res.status(201).json({
        code: 0,
        message: '订单创建成功',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户订单列表
   * GET /api/v1/orders
   */
  public getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }
      const orders = await this.orderService.findUserOrders(userId);
      res.status(200).json({
        code: 0,
        message: '获取订单列表成功',
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取订单详情
   * GET /api/v1/orders/:id
   */
  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }
      const orderId = req.params.id;
      const order = await this.orderService.findOrderById(orderId, userId);
      res.status(200).json({
        code: 0,
        message: '获取订单详情成功',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新订单状态
   * PUT /api/v1/orders/:id/status
   */
  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }
      const orderId = req.params.id;
      
      // 手动验证请求数据
      const statusDto = plainToClass(UpdateOrderStatusDto, req.body);
      const errors = await validate(statusDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      const order = await this.orderService.updateOrderStatus(orderId, userId, req.body);
      res.status(200).json({
        code: 0,
        message: '订单状态已更新',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：获取所有订单
   * GET /api/v1/orders/admin/all
   */
  public getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { orders, total } = await this.orderService.findAllOrders(page, limit);
      
      res.status(200).json({
        code: 0,
        message: '获取所有订单成功',
        data: {
          items: orders,
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：按条件筛选订单
   * GET /api/v1/orders/admin/filter
   */
  public filterOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        orderNo: req.query.orderNo as string,
        userId: req.query.userId as string,
        status: req.query.status as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };
      
      const { orders, total } = await this.orderService.filterOrders(filters);
      
      res.status(200).json({
        code: 0,
        message: '筛选订单成功',
        data: {
          items: orders,
          total,
          page: filters.page,
          limit: filters.limit,
          total_pages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：更新订单信息
   * PUT /api/v1/orders/admin/:id
   */
  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      const orderData = req.body;
      
      const updatedOrder = await this.orderService.updateOrder(orderId, orderData);
      
      res.status(200).json({
        code: 0,
        message: '订单信息已更新',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：删除订单
   * DELETE /api/v1/orders/admin/:id
   */
  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      
      await this.orderService.deleteOrder(orderId);
      
      res.status(200).json({
        code: 0,
        message: '订单已删除'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：获取订单统计数据
   * GET /api/v1/orders/admin/statistics
   */
  public getOrderStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      const statistics = await this.orderService.getOrderStatistics(startDate, endDate);
      
      res.status(200).json({
        code: 0,
        message: '获取订单统计数据成功',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：处理订单退款
   * POST /api/v1/orders/admin/:id/refund
   */
  public refundOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      const { reason, amount } = req.body;
      
      const refundResult = await this.orderService.refundOrder(orderId, reason, amount);
      
      res.status(200).json({
        code: 0,
        message: '订单退款处理成功',
        data: refundResult
      });
    } catch (error) {
      next(error);
    }
  };
} 