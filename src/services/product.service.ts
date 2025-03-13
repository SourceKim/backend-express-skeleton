import { AppDataSource } from '@/configs/database.config';
import { Product, Category } from '@/models/product.model';
import { Material } from '@/models/material.model';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { validateModel } from '@/middlewares/model-validation.middleware';
import { In } from 'typeorm';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private categoryRepository = AppDataSource.getRepository(Category);
  private materialRepository = AppDataSource.getRepository(Material);

  public async findAllProducts(page: number, limit: number, categoryId?: string): Promise<{ products: Product[], total: number }> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.status = :status', { status: 'active' });
    
    if (categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId });
    }
    
    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return { products, total };
  }

  public async findProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'images']
    });

    if (!product) {
      throw new HttpException(404, '产品不存在');
    }

    return product;
  }

  public async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['children']
    });
  }

  public async findCategoryById(categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['children', 'parent']
    });

    if (!category) {
      throw new HttpException(404, '分类不存在');
    }

    return category;
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    // 检查分类是否存在
    const category = await this.findCategoryById(productData.category_id);
    
    // 检查素材是否存在
    const materials = await this.materialRepository.find({
      where: { id: In(productData.images) }
    });

    if (materials.length !== productData.images.length) {
      throw new HttpException(400, '部分素材不存在');
    }

    // 创建产品对象，但不包含 images
    const { images, ...productDataWithoutImages } = productData;
    const newProduct = this.productRepository.create(productDataWithoutImages);
    
    // 验证模型数据
    await validateModel(newProduct);
    
    // 保存产品
    const savedProduct = await this.productRepository.save(newProduct);
    
    // 设置产品的素材
    savedProduct.images = materials;
    
    // 再次保存产品，以保存与素材的关联关系
    return this.productRepository.save(savedProduct);
  }

  public async updateProduct(productId: string, productData: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(productId);
    
    // 如果更新了分类，检查分类是否存在
    if (productData.category_id && productData.category_id !== product.category_id) {
      await this.findCategoryById(productData.category_id);
    }
    
    // 如果更新了素材，检查素材是否存在
    if (productData.images) {
      const materials = await this.materialRepository.find({
        where: { id: In(productData.images) }
      });

      if (materials.length !== productData.images.length) {
        throw new HttpException(400, '部分素材不存在');
      }

      // 更新产品的素材
      product.images = materials;
    }
    
    // 更新产品的其他属性
    const { images, ...productDataWithoutImages } = productData;
    Object.assign(product, productDataWithoutImages);
    
    // 验证模型数据
    await validateModel(product);
    
    // 保存产品
    return this.productRepository.save(product);
  }

  public async deleteProduct(productId: string): Promise<void> {
    const product = await this.findProductById(productId);
    await this.productRepository.remove(product);
  }

  public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    // 检查分类名称是否已存在
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: categoryData.name }
    });

    if (existingCategory) {
      throw new HttpException(400, '分类名称已存在');
    }

    // 如果有父分类，检查父分类是否存在
    if (categoryData.parent_id) {
      const parentCategory = await this.findCategoryById(categoryData.parent_id);
      if (!parentCategory) {
        throw new HttpException(400, '父分类不存在');
      }
    }

    const newCategory = this.categoryRepository.create(categoryData);
    await validateModel(newCategory);
    return this.categoryRepository.save(newCategory);
  }

  public async updateCategory(categoryId: string, categoryData: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(categoryId);

    // 如果要更新分类名称，检查新名称是否与其他分类重复
    if (categoryData.name && categoryData.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name }
      });

      if (existingCategory) {
        throw new HttpException(400, '分类名称已存在');
      }
    }

    // 如果要更新父分类，检查是否形成循环依赖
    if (categoryData.parent_id) {
      if (categoryData.parent_id === categoryId) {
        throw new HttpException(400, '不能将分类设置为自己的父分类');
      }

      const parentCategory = await this.findCategoryById(categoryData.parent_id);
      if (!parentCategory) {
        throw new HttpException(400, '父分类不存在');
      }

      // 检查是否会形成循环依赖
      let currentParent = parentCategory;
      while (currentParent.parent_id) {
        if (currentParent.parent_id === categoryId) {
          throw new HttpException(400, '不能将子分类设置为父分类');
        }
        currentParent = await this.findCategoryById(currentParent.parent_id);
      }
    }

    Object.assign(category, categoryData);
    await validateModel(category);
    return this.categoryRepository.save(category);
  }

  public async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.findCategoryById(categoryId);

    // 检查是否有子分类
    const hasChildren = await this.categoryRepository.count({
      where: { parent_id: categoryId }
    });

    if (hasChildren > 0) {
      throw new HttpException(400, '无法删除含有子分类的分类');
    }

    // 检查是否有关联的产品
    const hasProducts = await this.productRepository.count({
      where: { category_id: categoryId }
    });

    if (hasProducts > 0) {
      throw new HttpException(400, '无法删除含有关联产品的分类');
    }

    await this.categoryRepository.remove(category);
  }
} 