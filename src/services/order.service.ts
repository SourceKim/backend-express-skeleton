import { AppDataSource } from '@/configs/database.config';
import { Order } from '@/models/order.model';
import { Product } from '@/models/product.model';
import { Cart } from '@/models/cart.model';
import { CreateOrderDto, UpdateOrderStatusDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';
import { generateOrderNo } from '@/utils/order.util';
import { validateModel } from '@/middlewares/model-validation.middleware';
import { Between, FindOptionsWhere, Like } from 'typeorm';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private productRepository = AppDataSource.getRepository(Product);

  public async createOrder(userId: string, cartItems: Cart[], addressData: any): Promise<Order> {
    if (cartItems.length === 0) {
      throw new HttpException(400, '购物车为空，无法创建订单');
    }

    // 检查库存并计算总金额
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cartItems) {
      const product = await this.productRepository.findOne({ where: { id: item.product_id } });
      
      if (!product) {
        throw new HttpException(404, `产品ID为${item.product_id}的商品不存在`);
      }
      
      if (product.stock < item.quantity) {
        throw new HttpException(400, `产品"${product.name}"库存不足`);
      }
      
      // 减少库存
      product.stock -= item.quantity;
      await this.productRepository.save(product);
      
      // 计算小计金额
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      
      // 添加到订单商品列表
      orderProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 && product.images[0].path 
          ? product.images[0].path 
          : 'default-image.jpg' // 提供一个默认图片路径
      });
    }

    // 创建订单
    const orderNo = generateOrderNo();
    const newOrder = this.orderRepository.create({
      order_no: orderNo,
      user_id: userId,
      products: orderProducts,
      total_amount: totalAmount,
      status: 'pending',
      address: addressData
    });

    // 验证模型数据
    await validateModel(newOrder);

    // 保存订单
    return this.orderRepository.save(newOrder);
  }

  public async findUserOrders(userId: string): Promise<any> {
    const orders = await this.orderRepository.createQueryBuilder('order')
      .where('order.user_id = :userId', { userId })
      .orderBy('order.created_at', 'DESC')
      .getMany();
    return orders;
  }

  public async findOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.user_id = :userId', { userId })
      .getOne();
    
    if (!order) throw new HttpException(404, '订单不存在');
    
    return order;
  }

  public async updateOrderStatus(orderId: string, userId: string, statusData: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOrderById(orderId, userId);
    
    // 检查状态转换是否合法
    if (!this.isValidStatusTransition(order.status, statusData.status)) {
      throw new HttpException(400, '非法的状态转换');
    }
    
    // 如果取消订单，恢复库存
    if (statusData.status === 'cancelled' && order.status !== 'cancelled') {
      await this.restoreProductStock(order);
    }
    
    order.status = statusData.status;
    
    // 验证模型数据
    await validateModel(order);
    
    const updatedOrder = await this.orderRepository.save(order);
    return updatedOrder;
  }

  private async restoreProductStock(order: Order): Promise<void> {
    for (const item of order.products) {
      const product = await this.productRepository.findOne({ where: { id: item.id } });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const transitions: Record<string, string[]> = {
      'pending': ['paid', 'cancelled'],
      'paid': ['shipped', 'cancelled'],
      'shipped': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };
    
    return transitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * 管理员：获取所有订单
   */
  public async findAllOrders(page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number }> {
    const [orders, total] = await this.orderRepository.createQueryBuilder('order')
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return { orders, total };
  }

  /**
   * 管理员：按条件筛选订单
   */
  public async filterOrders(filters: any): Promise<{ orders: Order[], total: number }> {
    const { 
      orderNo, 
      userId, 
      status, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount,
      page = 1, 
      limit = 10 
    } = filters;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    
    if (orderNo) {
      queryBuilder.andWhere('order.order_no LIKE :orderNo', { orderNo: `%${orderNo}%` });
    }
    
    if (userId) {
      queryBuilder.andWhere('order.user_id = :userId', { userId });
    }
    
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }
    
    if (startDate && endDate) {
      queryBuilder.andWhere('order.created_at BETWEEN :startDate AND :endDate', { 
        startDate: new Date(startDate), 
        endDate: new Date(endDate) 
      });
    } else if (startDate) {
      queryBuilder.andWhere('order.created_at >= :startDate', { startDate: new Date(startDate) });
    }
    
    if (minAmount && maxAmount) {
      queryBuilder.andWhere('order.total_amount BETWEEN :minAmount AND :maxAmount', { 
        minAmount, 
        maxAmount 
      });
    } else if (minAmount) {
      queryBuilder.andWhere('order.total_amount >= :minAmount', { minAmount });
    } else if (maxAmount) {
      queryBuilder.andWhere('order.total_amount <= :maxAmount', { maxAmount });
    }
    
    queryBuilder.orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [orders, total] = await queryBuilder.getManyAndCount();
    
    return { orders, total };
  }

  /**
   * 管理员：获取订单统计数据
   */
  public async getOrderStatistics(): Promise<any> {
    // 获取总订单数
    const totalOrders = await this.orderRepository.count();
    
    // 获取各状态订单数
    const statusCounts = await Promise.all([
      this.orderRepository.count({ where: { status: 'pending' } }),
      this.orderRepository.count({ where: { status: 'paid' } }),
      this.orderRepository.count({ where: { status: 'shipped' } }),
      this.orderRepository.count({ where: { status: 'completed' } }),
      this.orderRepository.count({ where: { status: 'cancelled' } })
    ]);
    
    // 获取今日订单数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await this.orderRepository.count({
      where: {
        created_at: Between(today, tomorrow)
      }
    });
    
    // 获取总销售额
    const totalSalesResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where('order.status != :status', { status: 'cancelled' })
      .getRawOne();
    
    const totalSales = totalSalesResult?.total || 0;
    
    return {
      totalOrders,
      statusCounts: {
        pending: statusCounts[0],
        paid: statusCounts[1],
        shipped: statusCounts[2],
        completed: statusCounts[3],
        cancelled: statusCounts[4]
      },
      todayOrders,
      totalSales
    };
  }

  /**
   * 管理员：更新订单信息
   */
  public async updateOrder(orderId: string, orderData: any): Promise<Order> {
    const order = await this.orderRepository.createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .getOne();
    
    if (!order) throw new HttpException(404, '订单不存在');
    
    // 只允许更新特定字段
    if (orderData.status) {
      // 检查状态转换是否合法
      if (!this.isValidStatusTransition(order.status, orderData.status)) {
        throw new HttpException(400, '非法的状态转换');
      }
      
      // 如果取消订单，恢复库存
      if (orderData.status === 'cancelled' && order.status !== 'cancelled') {
        await this.restoreProductStock(order);
      }
      
      order.status = orderData.status;
    }
    
    if (orderData.address) {
      order.address = {
        ...order.address,
        ...orderData.address
      };
    }
    
    // 验证模型数据
    await validateModel(order);
    
    const updatedOrder = await this.orderRepository.save(order);
    return updatedOrder;
  }

  /**
   * 管理员：删除订单
   */
  public async deleteOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .getOne();
    
    if (!order) throw new HttpException(404, '订单不存在');
    
    // 如果订单不是已取消状态，恢复库存
    if (order.status !== 'cancelled') {
      await this.restoreProductStock(order);
    }
    
    await this.orderRepository.remove(order);
  }

  /**
   * 管理员：处理订单退款
   */
  public async refundOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .getOne();
    
    if (!order) throw new HttpException(404, '订单不存在');
    
    // 只有已支付或已发货的订单可以退款
    if (order.status !== 'paid' && order.status !== 'shipped') {
      throw new HttpException(400, '只有已支付或已发货的订单可以退款');
    }
    
    // 恢复库存
    await this.restoreProductStock(order);
    
    // 更新订单状态为已取消
    order.status = 'cancelled';
    
    // 验证模型数据
    await validateModel(order);
    
    const updatedOrder = await this.orderRepository.save(order);
    return updatedOrder;
  }
} 