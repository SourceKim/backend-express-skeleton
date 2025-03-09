import { AppDataSource } from '@/config/database';
import { Product } from '@/models/product.model';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { validateModel } from '@/middlewares/model-validation.middleware';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  public async findAllProducts(page: number, limit: number, category?: string): Promise<{ products: Product[], total: number }> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .where('product.status = :status', { status: 'active' });
    
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }
    
    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return { products, total };
  }

  public async findProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new HttpException(404, '产品不存在');
    
    return product;
  }

  public async findAllCategories(): Promise<string[]> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();
    
    return categories.map(item => item.category);
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(productData);
    
    // 验证模型数据
    await validateModel(newProduct);
    
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  public async updateProduct(productId: string, productData: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(productId);
    
    // 更新产品数据
    Object.assign(product, productData);
    
    // 验证模型数据
    await validateModel(product);
    
    await this.productRepository.save(product);
    return product;
  }

  public async deleteProduct(productId: string): Promise<void> {
    const product = await this.findProductById(productId);
    await this.productRepository.delete(productId);
  }
} 