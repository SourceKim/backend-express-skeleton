import { AppDataSource } from '@/config/database';
import { Cart } from '@/models/cart.model';
import { Product } from '@/models/product.model';
import { AddToCartDto, UpdateCartDto } from '@/dtos/cart.dto';
import { HttpException } from '@/exceptions/HttpException';
import { validateModel } from '@/middlewares/model-validation.middleware';

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private productRepository = AppDataSource.getRepository(Product);

  public async findUserCart(userId: string): Promise<Cart[]> {
    return this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .where('cart.user_id = :userId', { userId })
      .orderBy('cart.created_at', 'DESC')
      .getMany();
  }

  public async addToCart(userId: string, cartData: AddToCartDto): Promise<Cart> {
    // 检查产品是否存在
    const product = await this.productRepository.findOne({ where: { id: cartData.product_id } });
    if (!product) throw new HttpException(404, '产品不存在');
    
    // 检查库存
    if (product.stock < cartData.quantity) {
      throw new HttpException(400, '库存不足');
    }
    
    // 检查购物车中是否已有该商品
    let cart = await this.cartRepository.createQueryBuilder('cart')
      .where('cart.user_id = :userId', { userId })
      .andWhere('cart.product_id = :productId', { productId: cartData.product_id })
      .getOne();
    
    if (cart) {
      // 更新数量
      cart.quantity += cartData.quantity;
      
      // 验证模型数据
      await validateModel(cart);
      
      return this.cartRepository.save(cart);
    } else {
      // 创建新购物车项
      const newCart = this.cartRepository.create({
        user_id: userId,
        product_id: cartData.product_id,
        quantity: cartData.quantity
      });
      
      // 验证模型数据
      await validateModel(newCart);
      
      return this.cartRepository.save(newCart);
    }
  }

  public async updateCart(cartId: string, userId: string, cartData: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .where('cart.id = :cartId', { cartId })
      .andWhere('cart.user_id = :userId', { userId })
      .getOne();
    
    if (!cart) throw new HttpException(404, '购物车项不存在');
    
    // 检查库存
    if (cart.product.stock < cartData.quantity) {
      throw new HttpException(400, '库存不足');
    }
    
    cart.quantity = cartData.quantity;
    
    // 验证模型数据
    await validateModel(cart);
    
    return this.cartRepository.save(cart);
  }

  public async removeFromCart(cartId: string, userId: string): Promise<void> {
    const cart = await this.cartRepository.createQueryBuilder('cart')
      .where('cart.id = :cartId', { cartId })
      .andWhere('cart.user_id = :userId', { userId })
      .getOne();
    
    if (!cart) throw new HttpException(404, '购物车项不存在');
    
    await this.cartRepository.delete(cartId);
  }

  public async clearUserCart(userId: string): Promise<void> {
    await this.cartRepository.createQueryBuilder('cart')
      .delete()
      .where('cart.user_id = :userId', { userId })
      .execute();
  }

  /**
   * 管理员：获取所有用户的购物车
   */
  public async findAllCarts(page: number = 1, limit: number = 10): Promise<{ carts: Cart[], total: number }> {
    const [carts, total] = await this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .orderBy('cart.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return { carts, total };
  }

  /**
   * 管理员：获取特定用户的购物车
   */
  public async findUserCartByAdmin(userId: string): Promise<Cart[]> {
    const carts = await this.cartRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.product', 'product')
      .where('cart.user_id = :userId', { userId })
      .orderBy('cart.created_at', 'DESC')
      .getMany();
    
    return carts;
  }

  /**
   * 管理员：清空特定用户的购物车
   */
  public async clearUserCartByAdmin(userId: string): Promise<void> {
    const userExists = await AppDataSource.getRepository('users').findOne({ where: { id: userId } });
    if (!userExists) throw new HttpException(404, '用户不存在');
    
    await this.cartRepository.createQueryBuilder('cart')
      .delete()
      .where('cart.user_id = :userId', { userId })
      .execute();
  }

  /**
   * 管理员：删除特定购物车项
   */
  public async removeCartItemByAdmin(cartId: string): Promise<void> {
    const cart = await this.cartRepository.createQueryBuilder('cart')
      .where('cart.id = :cartId', { cartId })
      .getOne();
    
    if (!cart) throw new HttpException(404, '购物车项不存在');
    
    await this.cartRepository.delete(cartId);
  }
} 