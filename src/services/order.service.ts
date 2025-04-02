import { AppDataSource } from '@/configs/database.config';
import { Order, OrderItem, OrderStatus } from '@/models/order.model';
import { Product } from '@/models/product.model';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from '@/dtos/order.dto';
import { PaginatedResponse } from '@/dtos/common.dto';
import { FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private productRepository = AppDataSource.getRepository(Product);
  private readonly generateId: () => string;

  constructor() {
    // 生成16位随机ID的函数
    this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
  }

  /**
   * 创建订单
   */
  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // 开启事务
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 1. 验证商品是否存在并计算总价
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];
      
      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id as any }
        });
        
        if (!product) {
          throw new Error(`商品ID ${item.product_id} 不存在`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`商品 ${product.name} 库存不足`);
        }
        
        // 计算商品总价
        const itemPrice = product.price * item.quantity;
        totalPrice += itemPrice;
        
        // 减少库存
        product.stock -= item.quantity;
        await transactionalEntityManager.save(product);
        
        // 创建订单项
        const orderItem = new OrderItem();
        orderItem.id = this.generateId();
        orderItem.product_id = item.product_id;
        orderItem.quantity = item.quantity;
        orderItem.price = product.price;
        orderItems.push(orderItem);
      }
      
      // 2. 创建订单
      const order = new Order();
      order.id = this.generateId();
      order.order_number = uuidv4();
      order.user_id = userId;
      order.total_price = totalPrice;
      order.status = OrderStatus.PENDING;
      order.remark = createOrderDto.remark || '';
      
      // 3. 保存订单
      const savedOrder = await transactionalEntityManager.save(order);
      
      // 4. 保存订单项
      for (const item of orderItems) {
        item.order_id = savedOrder.id;
        await transactionalEntityManager.save(item);
      }
      
      // 5. 返回完整订单
      return await transactionalEntityManager.findOne(Order, {
        where: { id: savedOrder.id as any },
        relations: ['items', 'items.product']
      }) as Order;
    });
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: id as any }
    });
    
    if (!order) {
      throw new Error('订单不存在');
    }
    
    // 检查状态变更是否合法
    this.validateStatusChange(order.status, updateOrderStatusDto.status);
    
    // 更新状态
    order.status = updateOrderStatusDto.status;
    
    // 更新备注
    if (updateOrderStatusDto.remark) {
      order.remark = updateOrderStatusDto.remark;
    }
    
    return await this.orderRepository.save(order);
  }

  /**
   * 验证订单状态变更是否合法
   */
  private validateStatusChange(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    // 定义状态转换规则
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.REFUNDED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.REFUNDING],
      [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDING],
      [OrderStatus.COMPLETED]: [OrderStatus.REFUNDING],
      [OrderStatus.REFUNDING]: [OrderStatus.REFUNDED],
      [OrderStatus.REFUNDED]: []
    };
    
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`不允许从 ${currentStatus} 状态变更为 ${newStatus} 状态`);
    }
  }

  /**
   * 获取单个订单
   */
  async getOrderById(id: string, userId?: string): Promise<Order> {
    const where: FindOptionsWhere<Order> = { id: id as any };
    
    // 如果提供了用户ID，则只能查询自己的订单
    if (userId) {
      where.user_id = userId;
    }
    
    const order = await this.orderRepository.findOne({
      where,
      relations: ['items', 'items.product']
    });
    
    if (!order) {
      throw new Error('订单不存在');
    }
    
    return order;
  }

  /**
   * 获取订单列表
   */
  async getOrders(query: OrderQueryDto, userId?: string): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 20, order_number, status, start_date, end_date, min_price, max_price } = query;
    
    // 构建查询条件
    const where: FindOptionsWhere<Order> = {};
    
    // 如果提供了用户ID，则只能查询自己的订单
    if (userId) {
      where.user_id = userId;
    } else if (query.user_id) {
      where.user_id = query.user_id;
    }
    
    if (order_number) {
      where.order_number = order_number;
    }
    
    if (status) {
      where.status = status;
    }
    
    // 处理日期范围
    if (start_date && end_date) {
      where.created_at = Between(new Date(start_date), new Date(end_date)) as any;
    } else if (start_date) {
      where.created_at = MoreThanOrEqual(new Date(start_date)) as any;
    } else if (end_date) {
      where.created_at = LessThanOrEqual(new Date(end_date)) as any;
    }
    
    // 处理价格范围
    if (min_price !== undefined && max_price !== undefined) {
      where.total_price = Between(min_price, max_price) as any;
    } else if (min_price !== undefined) {
      where.total_price = Between(min_price, 999999999) as any;
    } else if (max_price !== undefined) {
      where.total_price = Between(0, max_price) as any;
    }
    
    // 查询总数
    const total = await this.orderRepository.count({ where });
    
    // 查询数据
    const orders = await this.orderRepository.find({
      where,
      relations: ['items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC'
      }
    });
    
    // 计算总页数
    const pages = Math.ceil(total / limit);
    
    return {
      items: orders,
      meta: {
        total,
        page,
        limit,
        pages
      }
    };
  }

  /**
   * 取消订单
   */
  async cancelOrder(id: string, userId: string): Promise<Order> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 查询订单
      const order = await this.orderRepository.findOne({
        where: { 
          id: id as any,
          user_id: userId as any
        },
        relations: ['items']
      });
      
      if (!order) {
        throw new Error('订单不存在');
      }
      
      // 只有待支付状态的订单可以取消
      if (order.status !== OrderStatus.PENDING) {
        throw new Error('只有待支付状态的订单可以取消');
      }
      
      // 恢复库存
      for (const item of order.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id as any }
        });
        
        if (product) {
          product.stock += item.quantity;
          await transactionalEntityManager.save(product);
        }
      }
      
      // 更新订单状态
      order.status = OrderStatus.REFUNDED;
      return await transactionalEntityManager.save(order);
    });
  }

  /**
   * 获取订单统计信息
   */
  async getOrderStats(startDate?: string, endDate?: string): Promise<any> {
    // 构建日期条件
    let dateWhere = {};
    if (startDate && endDate) {
      dateWhere = {
        created_at: Between(new Date(startDate), new Date(endDate))
      };
    } else if (startDate) {
      dateWhere = {
        created_at: MoreThanOrEqual(new Date(startDate))
      };
    } else if (endDate) {
      dateWhere = {
        created_at: LessThanOrEqual(new Date(endDate))
      };
    }
    
    // 查询各状态订单数量
    const statusCounts = await Promise.all(
      Object.values(OrderStatus).map(async (status) => {
        const count = await this.orderRepository.count({
          where: {
            ...dateWhere,
            status
          } as any
        });
        
        return { status, count };
      })
    );
    
    // 查询总销售额
    const totalSales = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_price)', 'total')
      .where('order.status IN (:...statuses)', { 
        statuses: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED] 
      })
      .andWhere(dateWhere)
      .getRawOne();
    
    // 查询订单总数
    const totalOrders = await this.orderRepository.count({
      where: dateWhere as any
    });
    
    return {
      totalOrders,
      totalSales: totalSales?.total || 0,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<OrderStatus, number>)
    };
  }
} 