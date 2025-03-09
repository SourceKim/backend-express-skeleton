import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { OrderService } from '@/services/order.service';
import { CartService } from '@/services/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';

export class OrderController {
  private orderService = new OrderService();
  private cartService = new CartService();

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      
      // 手动验证请求数据
      const orderDto = plainToClass(CreateOrderDto, req.body);
      const errors = await validate(orderDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        res.status(400).json({ message });
        return;
      }
      
      // 获取用户购物车
      const cartItems = await this.cartService.findUserCart(userId);
      
      if (cartItems.length === 0) {
        res.status(400).json({ message: '购物车为空，无法创建订单' });
        return;
      }
      
      // 创建订单
      const order = await this.orderService.createOrder(userId, cartItems, req.body.address);
      
      // 清空购物车
      await this.cartService.clearUserCart(userId);
      
      res.status(201).json({ data: order, message: '订单创建成功' });
    } catch (error) {
      next(error);
    }
  };

  public getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      const orders = await this.orderService.findUserOrders(userId);
      res.status(200).json({ data: orders });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      const orderId = req.params.id;
      const order = await this.orderService.findOrderById(orderId, userId);
      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
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
        res.status(400).json({ message });
        return;
      }
      
      const order = await this.orderService.updateOrderStatus(orderId, userId, req.body);
      res.status(200).json({ data: order, message: '订单状态已更新' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：获取所有订单
   */
  public getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { orders, total } = await this.orderService.findAllOrders(page, limit);
      
      res.status(200).json({
        data: orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：按条件筛选订单
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
        data: orders,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：更新订单信息
   */
  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      const orderData = req.body;
      
      const updatedOrder = await this.orderService.updateOrder(orderId, orderData);
      
      res.status(200).json({
        data: updatedOrder,
        message: '订单信息已更新'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：删除订单
   */
  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      
      await this.orderService.deleteOrder(orderId);
      
      res.status(200).json({
        message: '订单已删除'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：获取订单统计数据
   */
  public getOrderStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await this.orderService.getOrderStatistics();
      
      res.status(200).json({
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 管理员：处理订单退款
   */
  public refundOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;
      
      const updatedOrder = await this.orderService.refundOrder(orderId);
      
      res.status(200).json({
        data: updatedOrder,
        message: '订单已退款并取消'
      });
    } catch (error) {
      next(error);
    }
  };
} 