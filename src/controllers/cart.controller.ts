import { Request, Response } from 'express';
import { CartService } from '@/services/cart.service';
import { AddCartItemDto, UpdateCartItemDto, CartDto, PaginatedCartsResponse } from '@/dtos/cart.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiResponse, PaginationQueryDto } from '@/dtos/common.dto';

export class CartController {
  private cartService = new CartService();

  /**
   * 获取用户购物车
   */
  getUserCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          code: 401,
          message: '未授权'
        });
        return;
      }

      const cart = await this.cartService.getUserCart(userId);
      res.status(200).json({
        code: 0,
        data: cart
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '获取购物车失败',
        error
      });
    }
  };

  /**
   * 添加商品到购物车
   */
  addCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          code: 401,
          message: '未授权'
        });
        return;
      }

      const addCartItemDto = plainToClass(AddCartItemDto, req.body);
      const errors = await validate(addCartItemDto);

      if (errors.length > 0) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: errors
        });
        return;
      }

      const cart = await this.cartService.addCartItem(userId, addCartItemDto);
      res.status(200).json({
        code: 0,
        message: '添加商品到购物车成功',
        data: cart
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '添加商品到购物车失败',
        error
      });
    }
  };

  /**
   * 更新购物车项数量
   */
  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          code: 401,
          message: '未授权'
        });
        return;
      }

      const itemId = req.params.id;
      const updateCartItemDto = plainToClass(UpdateCartItemDto, req.body);
      const errors = await validate(updateCartItemDto);

      if (errors.length > 0) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: errors
        });
        return;
      }

      const cart = await this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
      res.status(200).json({
        code: 0,
        message: '更新购物车项数量成功',
        data: cart
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '更新购物车项数量失败',
        error
      });
    }
  };

  /**
   * 移除购物车项
   */
  removeCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          code: 401,
          message: '未授权'
        });
        return;
      }

      const itemId = req.params.id;
      const cart = await this.cartService.removeCartItem(userId, itemId);
      res.status(200).json({
        code: 0,
        message: '移除购物车项成功',
        data: cart
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '移除购物车项失败',
        error
      });
    }
  };

  /**
   * 清空购物车
   */
  clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          code: 401,
          message: '未授权'
        });
        return;
      }

      const cart = await this.cartService.clearCart(userId);
      res.status(200).json({
        code: 0,
        message: '清空购物车成功',
        data: cart
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '清空购物车失败',
        error
      });
    }
  };

  /**
   * 获取所有用户的购物车（管理员）
   */
  getAllCarts = async (req: Request, res: Response<ApiResponse<PaginatedCartsResponse>>): Promise<void> => {
    try {

      // 解析查询参数
      const query = req.query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const sort_by = query.sort_by as string || 'created_at';
      const sort_order = (query.sort_order as 'ASC' | 'DESC') || 'DESC';

      // 获取所有购物车
      const { items, total } = await this.cartService.getAllCarts(page, limit, sort_by, sort_order);

      // 转换为DTO
      const cartDtos: CartDto[] = items.map(cart => ({
        id: cart.id,
        user_id: cart.user_id,
        // 添加用户信息
        user: cart.user ? {
          id: cart.user.id,
          username: cart.user.username
        } : undefined,
        items: cart.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            // 添加可选字段检查
            image: undefined // 因为Product模型中没有image字段
          } : undefined,
          quantity: item.quantity,
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        total_price: cart.total_price,
        created_at: cart.created_at,
        updated_at: cart.updated_at
      }));

      // 返回分页数据
      res.status(200).json({
        code: 0,
        message: '获取所有购物车成功',
        data: {
          items: cartDtos,
          meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            sort_by,
            sort_order
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '获取所有购物车失败',
        error
      });
    }
  };
} 