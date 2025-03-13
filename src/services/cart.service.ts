import { AppDataSource } from '@/configs/database.config';
import { Cart, CartItem } from '@/models/cart.model';
import { Product } from '@/models/product.model';
import { AddCartItemDto, UpdateCartItemDto } from '@/dtos/cart.dto';

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);

  /**
   * 获取或创建用户购物车
   */
  private async getOrCreateCart(userId: number): Promise<Cart> {
    // 查找用户购物车
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId as any },
      relations: ['items', 'items.product']
    });
    
    // 如果不存在则创建
    if (!cart) {
      cart = new Cart();
      cart.user_id = userId;
      cart.total_price = 0;
      cart = await this.cartRepository.save(cart);
    }
    
    return cart;
  }

  /**
   * 获取用户购物车
   */
  async getUserCart(userId: number): Promise<Cart> {
    return await this.getOrCreateCart(userId);
  }

  /**
   * 添加商品到购物车
   */
  async addCartItem(userId: number, addCartItemDto: AddCartItemDto): Promise<Cart> {
    const { product_id, quantity } = addCartItemDto;
    
    // 验证商品是否存在
    const product = await this.productRepository.findOne({
      where: { id: product_id as any }
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
    
    // 检查购物车中是否已存在该商品
    let cartItem = cart.items.find(item => item.product_id === product_id);
    
    if (cartItem) {
      // 如果已存在，则更新数量
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      // 如果不存在，则创建新的购物车项
      cartItem = new CartItem();
      cartItem.cart_id = Number(cart.id);
      cartItem.product_id = product_id;
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }
    
    // 更新购物车总价
    await this.updateCartTotalPrice(Number(cart.id));
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 更新购物车项数量
   */
  async updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { quantity } = updateCartItemDto;
    
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 查找购物车项
    const cartItem = await this.cartItemRepository.findOne({
      where: { 
        id: itemId as any,
        cart_id: cart.id as any
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
    await this.updateCartTotalPrice(Number(cart.id));
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 移除购物车项
   */
  async removeCartItem(userId: number, itemId: number): Promise<Cart> {
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 查找购物车项
    const cartItem = await this.cartItemRepository.findOne({
      where: { 
        id: itemId as any,
        cart_id: cart.id as any
      }
    });
    
    if (!cartItem) {
      throw new Error('购物车项不存在');
    }
    
    // 删除购物车项
    await this.cartItemRepository.remove(cartItem);
    
    // 更新购物车总价
    await this.updateCartTotalPrice(Number(cart.id));
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: number): Promise<Cart> {
    // 获取购物车
    const cart = await this.getOrCreateCart(userId);
    
    // 删除所有购物车项
    await this.cartItemRepository.delete({ cart_id: cart.id as any });
    
    // 更新购物车总价
    cart.total_price = 0;
    await this.cartRepository.save(cart);
    
    // 返回更新后的购物车
    return await this.getUserCart(userId);
  }

  /**
   * 更新购物车总价
   */
  private async updateCartTotalPrice(cartId: number): Promise<void> {
    // 查询购物车所有项
    const cartItems = await this.cartItemRepository.find({
      where: { cart_id: cartId as any },
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
      { id: cartId as any },
      { total_price: totalPrice }
    );
  }
} 