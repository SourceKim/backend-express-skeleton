import { AppDataSource } from '@/configs/database.config';
import { Cart, CartItem } from '@/models/cart.model';
import { Product } from '@/models/product.model';
import { AddCartItemDto, UpdateCartItemDto } from '@/dtos/cart.dto';
import { customAlphabet } from 'nanoid';

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);
  private readonly generateId: () => string;

  constructor() {
    // 生成16位随机ID的函数
    this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
  }
  
  /**
   * 获取或创建用户购物车
   */
  private async getOrCreateCart(userId: string): Promise<Cart> {
    console.log('userId', userId);
    // 查找用户购物车
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items', 'items.product']
    });
    
    // 如果不存在则创建
    if (!cart) {
      try {
        cart = new Cart();
        cart.id = this.generateId();
        cart.user_id = userId;
        cart.total_price = 0;
        cart = await this.cartRepository.save(cart);
      } catch (error) {
        console.error('创建购物车失败:', error);
        throw new Error('创建购物车失败: ' + (error as Error).message);
      }
    }
    
    return cart;
  }

  /**
   * 获取用户购物车
   */
  async getUserCart(userId: string): Promise<Cart> {
    return await this.getOrCreateCart(userId);
  }

  /**
   * 添加商品到购物车
   */
  async addCartItem(userId: string, addCartItemDto: AddCartItemDto): Promise<Cart> {
    const { product_id, quantity } = addCartItemDto;
    
    // 验证商品是否存在
    const product = await this.productRepository.findOne({
      where: { id: product_id }
    });
    
    if (!product) {
      throw new Error('商品不存在');
    }
    
    // 验证库存是否充足
    if (product.stock < quantity) {
      throw new Error(`商品 ${product.name} 库存不足`);
    }
    
    // 获取或创建购物车
    const cart = await this.getOrCreateCart(userId);
    console.log('cart:', cart);
    console.log('cart.items:', cart.items);
    
    // 检查购物车中是否已存在该商品
    let cartItem = cart.items.find(item => item.product_id === product_id);
    
    if (cartItem) {
      // 如果已存在，则更新数量
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      // 如果不存在，则创建新的购物车项
      try {
        cartItem = new CartItem();
        cartItem.id = this.generateId();
        cartItem.cart_id = cart.id;
        cartItem.product_id = product_id;
        cartItem.quantity = quantity;
        await this.cartItemRepository.save(cartItem);
      } catch (error) {
        console.error('创建购物车项失败:', error);
        throw new Error('创建购物车项失败: ' + (error as Error).message);
      }
    }
    
    // 更新购物车总价
    await this.updateCartTotalPrice(cart.id);
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 更新购物车项数量
   */
  async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { quantity } = updateCartItemDto;
    
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 查找购物车项
    const cartItem = await this.cartItemRepository.findOne({
      where: { 
        id: itemId,
        cart_id: cart.id
      },
      relations: ['product']
    });
    
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }
    
    // 验证库存是否充足
    if (cartItem.product && cartItem.product.stock < quantity) {
      throw new Error(`商品 ${cartItem.product.name} 库存不足`);
    }
    
    // 更新数量
    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    
    // 更新购物车总价
    await this.updateCartTotalPrice(cart.id);
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 移除购物车项
   */
  async removeCartItem(userId: string, itemId: string): Promise<Cart> {
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 查找购物车项
    const cartItem = await this.cartItemRepository.findOne({
      where: { 
        id: itemId,
        cart_id: cart.id
      }
    });
    
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }
    
    // 删除购物车项
    await this.cartItemRepository.remove(cartItem);
    
    // 更新购物车总价
    await this.updateCartTotalPrice(cart.id);
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: string): Promise<Cart> {
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 删除所有购物车项
    await this.cartItemRepository.delete({ cart_id: cart.id });
    
    // 更新购物车总价
    cart.total_price = 0;
    await this.cartRepository.save(cart);
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 更新购物车总价
   */
  private async updateCartTotalPrice(cartId: string): Promise<void> {
    // 查询购物车所有项
    const cartItems = await this.cartItemRepository.find({
      where: { cart_id: cartId },
      relations: ['product']
    });
    
    // 计算总价
    let totalPrice = 0;
    for (const item of cartItems) {
      if (item.product) {
        totalPrice += item.product.price * item.quantity;
      }
    }
    
    // 更新购物车总价
    await this.cartRepository.update(
      { id: cartId },
      { total_price: totalPrice }
    );
  }

  /**
   * 获取所有用户的购物车（管理员）
   */
  async getAllCarts(page: number = 1, limit: number = 20, sortBy: string = 'created_at', sortOrder: 'ASC' | 'DESC' = 'DESC'): Promise<{items: Cart[], total: number}> {
    // 创建查询构建器
    const qb = this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('cart.user', 'user');
    
    // 设置排序
    qb.orderBy(`cart.${sortBy}`, sortOrder);
    
    // 设置分页
    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    
    return { items, total };
  }
} 