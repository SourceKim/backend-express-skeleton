import { AppDataSource } from '@/config/database';
import { Order } from '@/models/order.model';
import { Product } from '@/models/product.model';
import { Cart } from '@/models/cart.model';
import { CreateOrderDto, UpdateOrderStatusDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';
import { generateOrderNo } from '@/utils/order.util';
import { validateModel } from '@/middlewares/model-validation.middleware';

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
    } as any);

    // 验证模型数据
    await validateModel(newOrder);

    const result = await this.orderRepository.save(newOrder);
    return result as unknown as Order;
  }

  public async findUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId: userId as any },
      order: { created_at: 'DESC' }
    });
  }

  public async findOrderById(orderId: number, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId: userId as any }
    });
    
    if (!order) throw new HttpException(404, '订单不存在');
    
    return order;
  }

  public async updateOrderStatus(orderId: number, userId: string, statusData: UpdateOrderStatusDto): Promise<Order> {
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
    
    return this.orderRepository.save(order);
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
} 