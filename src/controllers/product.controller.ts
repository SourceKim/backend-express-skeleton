import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ProductService } from '@/services/product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { ApiResponse } from '@/dtos/common.dto';

/**
 * 产品控制器
 * 处理产品和分类相关的请求
 */
export class ProductController {
  private productService = new ProductService();

  /**
   * 获取产品列表
   * GET /api/v1/products
   */
  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryId = req.query.category_id as string;
      
      const products = await this.productService.findAllProducts(page, limit, categoryId);
      res.status(200).json({
        code: 0,
        message: '获取产品列表成功',
        data: {
          items: products.products,
          total: products.total,
          page,
          limit,
          total_pages: Math.ceil(products.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取产品详情
   * GET /api/v1/products/:id
   */
  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const product = await this.productService.findProductById(productId);
      res.status(200).json({
        code: 0,
        message: '获取产品详情成功',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取所有产品分类
   * GET /api/v1/products/categories
   */
  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.productService.findAllCategories();
      res.status(200).json({
        code: 0,
        message: '获取产品分类成功',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建产品
   * POST /api/v1/products/admin/products
   */
  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 手动验证请求数据
      const productDto = plainToClass(CreateProductDto, req.body);
      const errors = await validate(productDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      // 转换为正确的类型
      const productData = req.body as unknown as CreateProductDto;
      const newProduct = await this.productService.createProduct(productData);
      res.status(201).json({
        code: 0,
        message: '产品创建成功',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新产品
   * PUT /api/v1/products/admin/products/:id
   */
  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      
      // 手动验证请求数据
      const productDto = plainToClass(UpdateProductDto, req.body);
      const errors = await validate(productDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      // 转换为正确的类型
      const productData = req.body as unknown as UpdateProductDto;
      const updatedProduct = await this.productService.updateProduct(productId, productData);
      res.status(200).json({
        code: 0,
        message: '产品更新成功',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除产品
   * DELETE /api/v1/products/admin/products/:id
   */
  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      await this.productService.deleteProduct(productId);
      res.status(200).json({
        code: 0,
        message: '产品删除成功'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建产品分类
   * POST /api/v1/products/admin/categories
   */
  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 修复类型错误，确保 categoryDto 是单个对象而不是数组
      const categoryData = req.body;
      const categoryDto = new CreateCategoryDto(categoryData);
      const errors = await validate(categoryDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      const newCategory = await this.productService.createCategory(categoryDto);
      res.status(201).json({
        code: 0,
        message: '创建分类成功',
        data: newCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新产品分类
   * PUT /api/v1/products/admin/categories/:id
   */
  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      // 修复类型错误，确保 categoryDto 是单个对象而不是数组
      const categoryData = req.body;
      const categoryDto = new UpdateCategoryDto(categoryData);
      const errors = await validate(categoryDto);
      
      if (errors.length > 0) {
        const message = errors
          .map(error => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        throw new HttpException(400, message);
      }
      
      const updatedCategory = await this.productService.updateCategory(categoryId, categoryDto);
      res.status(200).json({
        code: 0,
        message: '更新分类成功',
        data: updatedCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除产品分类
   * DELETE /api/v1/products/admin/categories/:id
   */
  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      await this.productService.deleteCategory(categoryId);
      res.status(200).json({
        code: 0,
        message: '删除分类成功'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取产品分类详情
   * GET /api/v1/products/categories/:id
   */
  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const category = await this.productService.findCategoryById(categoryId);
      res.status(200).json({
        code: 0,
        message: '获取分类详情成功',
        data: category
      });
    } catch (error) {
      next(error);
    }
  };
} 