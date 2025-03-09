import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ProductService } from '@/services/product.service';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';

export class ProductController {
  private productService = new ProductService();

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      
      const products = await this.productService.findAllProducts(page, limit, category);
      res.status(200).json({
        data: products.products,
        total: products.total,
        page,
        limit,
        totalPages: Math.ceil(products.total / limit)
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const product = await this.productService.findProductById(productId);
      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.productService.findAllCategories();
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  };

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
        res.status(400).json({ message });
        return;
      }
      
      // 转换为正确的类型
      const productData = req.body as unknown as CreateProductDto;
      const newProduct = await this.productService.createProduct(productData);
      res.status(201).json({ data: newProduct, message: '产品创建成功' });
    } catch (error) {
      next(error);
    }
  };

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
        res.status(400).json({ message });
        return;
      }
      
      // 转换为正确的类型
      const productData = req.body as unknown as UpdateProductDto;
      const updatedProduct = await this.productService.updateProduct(productId, productData);
      res.status(200).json({ data: updatedProduct, message: '产品更新成功' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      await this.productService.deleteProduct(productId);
      res.status(200).json({ message: '产品删除成功' });
    } catch (error) {
      next(error);
    }
  };
} 