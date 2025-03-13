import { Request, Response } from 'express';
import { CartService } from '@/services/cart.service';
import { AddCartItemDto, UpdateCartItemDto } from '@/dtos/cart.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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

      const cart = await this.cartService.getUserCart(Number(userId));
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

      const cart = await this.cartService.addCartItem(Number(userId), addCartItemDto);
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

      const itemId = Number(req.params.id);
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

      const cart = await this.cartService.updateCartItem(Number(userId), itemId, updateCartItemDto);
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

      const itemId = Number(req.params.id);
      const cart = await this.cartService.removeCartItem(Number(userId), itemId);
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

      const cart = await this.cartService.clearCart(Number(userId));
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
  getAllCarts = async (req: Request, res: Response): Promise<void> => {
    try {
      // 这个功能通常不需要，但如果需要审计可以实现
      res.status(501).json({
        code: 501,
        message: '功能未实现'
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