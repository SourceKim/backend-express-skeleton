import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CartService } from '@/services/cart.service';
import { AddToCartDto, UpdateCartDto } from '@/dtos/cart.dto';
import { HttpException } from '@/exceptions/HttpException';

export class CartController {
  private cartService = new CartService();

  public getUserCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      const cartItems = await this.cartService.findUserCart(userId);
      res.status(200).json({ data: cartItems });
    } catch (error) {
      next(error);
    }
  };

  public addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      
      // 手动验证请求数据
      const cartDto = plainToClass(AddToCartDto, req.body);
      const errors = await validate(cartDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        res.status(400).json({ message });
        return;
      }
      
      // 转换为正确的类型
      const cartData = req.body as unknown as AddToCartDto;
      const cartItem = await this.cartService.addToCart(userId, cartData);
      res.status(201).json({ data: cartItem, message: '商品已添加到购物车' });
    } catch (error) {
      next(error);
    }
  };

  public updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      const cartId = parseInt(req.params.id);
      
      // 手动验证请求数据
      const cartDto = plainToClass(UpdateCartDto, req.body);
      const errors = await validate(cartDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        res.status(400).json({ message });
        return;
      }
      
      // 转换为正确的类型
      const cartData = req.body as unknown as UpdateCartDto;
      const updatedCart = await this.cartService.updateCart(cartId, userId, cartData);
      res.status(200).json({ data: updatedCart, message: '购物车已更新' });
    } catch (error) {
      next(error);
    }
  };

  public removeFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      const cartId = parseInt(req.params.id);
      await this.cartService.removeFromCart(cartId, userId);
      res.status(200).json({ message: '商品已从购物车移除' });
    } catch (error) {
      next(error);
    }
  };

  public clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }
      await this.cartService.clearUserCart(userId);
      res.status(200).json({ message: '购物车已清空' });
    } catch (error) {
      next(error);
    }
  };
} 