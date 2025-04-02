import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@/services/product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto, ProductQueryDto } from '@/dtos/product.dto';
import { PaginationQueryDto, ApiResponse } from '@/dtos/common.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpException } from '@/exceptions/http.exception';

export class ProductController {
  private productService = new ProductService();

  /**
   * 创建商品
   */
  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createProductDto = plainToClass(CreateProductDto, req.body);
      const errors = await validate(createProductDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const product = await this.productService.createProduct(createProductDto);
      res.status(201).json({
        code: 0,
        message: '创建商品成功',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新商品
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const updateProductDto = plainToClass(UpdateProductDto, req.body);
      const errors = await validate(updateProductDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const product = await this.productService.updateProduct(id, updateProductDto);
      res.status(200).json({
        code: 0,
        message: '更新商品成功',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除商品
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      await this.productService.deleteProduct(id);
      res.status(200).json({
        code: 0,
        message: '删除商品成功'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取单个商品
   */
  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const product = await this.productService.getProductById(id);
      res.status(200).json({
        code: 0,
        message: '获取商品详情成功',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取商品列表
   */
  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryDto = plainToClass(ProductQueryDto, req.query);
      const errors = await validate(queryDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const products = await this.productService.getProducts(queryDto);
      res.status(200).json({
        code: 0,
        message: '获取商品列表成功',
        data: products
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建商品分类
   */
  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createCategoryDto = plainToClass(CreateCategoryDto, req.body);
      const errors = await validate(createCategoryDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const category = await this.productService.createCategory(createCategoryDto);
      res.status(201).json({
        code: 0,
        message: '创建分类成功',
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新商品分类
   */
  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const updateCategoryDto = plainToClass(UpdateCategoryDto, req.body);
      const errors = await validate(updateCategoryDto);

      if (errors.length > 0) {
        throw new HttpException(400, '请求参数错误', errors);
      }

      const category = await this.productService.updateCategory(id, updateCategoryDto);
      res.status(200).json({
        code: 0,
        message: '更新分类成功',
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除商品分类
   */
  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      await this.productService.deleteCategory(id);
      res.status(200).json({
        code: 0,
        message: '删除分类成功'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取所有商品分类
   */
  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 从查询参数中获取分页参数
      const query = PaginationQueryDto.fromRequest(req.query);
      
      // 调用服务获取分页数据
      const categories = await this.productService.getAllCategories(
        query.page,
        query.limit,
        query.sort_by,
        query.sort_order
      );
      
      res.status(200).json({
        code: 0,
        message: '获取分类列表成功',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  };
} 