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
      
      // 转换为正确的类型
      const orderData = req.body as unknown as CreateOrderDto;
      
      // 获取用户购物车
      const cartItems = await this.cartService.findUserCart(userId);
      if (cartItems.length === 0) {
        res.status(400).json({ message: '购物车为空，无法创建订单' });
        return;
      }
      
      // 创建订单
      const order = await this.orderService.createOrder(userId, cartItems, orderData.address);
      
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
      const orderId = parseInt(req.params.id);
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
      const orderId = parseInt(req.params.id);
      
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
      
      // 转换为正确的类型
      const statusData = req.body as unknown as UpdateOrderStatusDto;
      
      const updatedOrder = await this.orderService.updateOrderStatus(orderId, userId, statusData);
      res.status(200).json({ data: updatedOrder, message: '订单状态已更新' });
    } catch (error) {
      next(error);
    }
  };
} 