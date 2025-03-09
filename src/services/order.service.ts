import { AppDataSource } from '@/config/database';
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
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      
      if (!product) {
        throw new HttpException(404, `产品ID为${item.productId}的商品不存在`);
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
        image: product.image
      });
    }

    // 创建订单
    const orderNo = generateOrderNo();
    const newOrder = this.orderRepository.create({
      orderNo,
      userId,
      products: orderProducts,
      totalAmount,
      status: 'pending',
      address: addressData
    });

    // 验证模型数据
    await validateModel(newOrder);

    const savedOrder = await this.orderRepository.save(newOrder);
    return savedOrder;
  }

  public async findUserOrders(userId: string): Promise<any> {
    const orders = await this.orderRepository.find({
      where: { userId },
      order: { created_at: 'DESC' }
    });
    return orders;
  }

  public async findOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId }
    });
    
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
    const [orders, total] = await this.orderRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
    
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

    const where: FindOptionsWhere<Order> = {};

    if (orderNo) where.orderNo = Like(`%${orderNo}%`);
    if (userId) where.userId = userId;
    if (status) where.status = status;
    
    if (startDate && endDate) {
      where.created_at = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.created_at = Between(new Date(startDate), new Date());
    }
    
    if (minAmount && maxAmount) {
      where.totalAmount = Between(minAmount, maxAmount);
    } else if (minAmount) {
      where.totalAmount = Between(minAmount, 999999999);
    } else if (maxAmount) {
      where.totalAmount = Between(0, maxAmount);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
    
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
      .select('SUM(order.totalAmount)', 'total')
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });
    
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });
    
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });
    
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