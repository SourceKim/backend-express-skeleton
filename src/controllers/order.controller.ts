import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from '@/dtos/order.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpException } from '@/exceptions/http.exception';

export class OrderController {
  private orderService = new OrderService();

  /**
   * 创建订单
   */
  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }

      const createOrderDto = plainToClass(CreateOrderDto, req.body);
      const errors = await validate(createOrderDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const order = await this.orderService.createOrder(Number(userId), createOrderDto);
      res.status(201).json({
        code: 0,
        message: '创建订单成功',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新订单状态
   */
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const updateOrderStatusDto = plainToClass(UpdateOrderStatusDto, req.body);
      const errors = await validate(updateOrderStatusDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const order = await this.orderService.updateOrderStatus(id, updateOrderStatusDto);
      res.status(200).json({
        code: 0,
        message: '更新订单状态成功',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户订单列表
   */
  getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }

      const queryDto = plainToClass(OrderQueryDto, req.query);
      const errors = await validate(queryDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const orders = await this.orderService.getOrders(queryDto, Number(userId));
      res.status(200).json({
        code: 0,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取所有订单列表（管理员）
   */
  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryDto = plainToClass(OrderQueryDto, req.query);
      const errors = await validate(queryDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const orders = await this.orderService.getOrders(queryDto);
      res.status(200).json({
        code: 0,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户订单详情
   */
  getUserOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }

      const id = Number(req.params.id);
      const order = await this.orderService.getOrderById(id, Number(userId));
      res.status(200).json({
        code: 0,
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 取消订单
   */
  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(401, '未授权');
      }

      const id = Number(req.params.id);
      const order = await this.orderService.cancelOrder(id, Number(userId));
      res.status(200).json({
        code: 0,
        message: '取消订单成功',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取订单统计信息
   */
  getOrderStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { start_date, end_date } = req.query;
      const stats = await this.orderService.getOrderStats(
        start_date as string | undefined,
        end_date as string | undefined
      );
      res.status(200).json({
        code: 0,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
} 