import { AppDataSource } from '@/configs/database.config';
import { Product, ProductStatus, ProductCategory } from '@/models/product.model';
import { CreateCategoryDto, UpdateCategoryDto, CreateProductDto, UpdateProductDto, ProductQueryDto } from '@/dtos/product.dto';
import { Material } from '@/models/material.model';
import { PaginatedResponse } from '@/dtos/common.dto';
import { Like, Between, FindOptionsWhere, In } from 'typeorm';
import { customAlphabet } from 'nanoid';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private categoryRepository = AppDataSource.getRepository(ProductCategory);
  private materialRepository = AppDataSource.getRepository(Material);
  private readonly generateId: () => string;

  constructor() {
    // 生成16位随机ID的函数
    this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
  }

  /**
   * 创建商品分类
   */
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<ProductCategory> {
    if (!createCategoryDto.name) {
      throw new Error('分类名称不能为空');
    }
    
    const category = new ProductCategory();
    category.id = this.generateId();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description || '';
    return await this.categoryRepository.save(category);
  }

  /**
   * 更新商品分类
   */
  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: id as any }
    });
    
    if (!category) {
      throw new Error('分类不存在');
    }

    this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * 删除商品分类
   */
  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id as any },
      relations: ['products']
    });

    if (!category) {
      throw new Error('分类不存在');
    }

    if (category.products && category.products.length > 0) {
      throw new Error('该分类下存在商品，无法删除');
    }

    await this.categoryRepository.remove(category);
  }

  /**
   * 获取所有商品分类
   */
  async getAllCategories(page: number = 1, limit: number = 20, sort_by: string = 'created_at', sort_order: 'ASC' | 'DESC' = 'DESC'): Promise<PaginatedResponse<ProductCategory>> {
    // 使用QueryBuilder进行分页查询
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    
    // 排序
    queryBuilder.orderBy(`category.${sort_by}`, sort_order);
    
    // 分页
    const [categories, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    // 计算总页数
    const pages = Math.ceil(total / limit);
    
    return {
      items: categories,
      meta: {
        total,
        page,
        limit,
        pages,
        sort_by,
        sort_order
      }
    };
  }

  /**
   * 获取单个商品分类
   */
    async getCategoryById(id: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: id as any }
    });
    
    if (!category) {
      throw new Error('分类不存在');
    }
    return category;
  }

  /**
   * 创建商品
   */
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    if (!createProductDto.name) {
      throw new Error('商品名称不能为空');
    }
    
    const { material_ids, ...productData } = createProductDto;
    
    // 创建商品
    const product = new Product();
    product.id = this.generateId();
    product.name = productData.name;
    product.description = productData.description || '';
    product.price = productData.price;
    product.stock = productData.stock;
    product.status = productData.status || ProductStatus.ACTIVE;
    product.category_id = productData.category_id || '';
    
    // 保存商品
    const savedProduct = await this.productRepository.save(product);
    
    // 如果有素材ID，关联素材
    if (material_ids && material_ids.length > 0) {
      const materials = await this.materialRepository.findBy({
        id: In(material_ids)
      });
      savedProduct.materials = materials;
      await this.productRepository.save(savedProduct);
    }
    
    return savedProduct;
  }

  /**
   * 更新商品
   */
    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { material_ids, ...productData } = updateProductDto;
    
    // 查找商品
    const product = await this.productRepository.findOne({
      where: { id: id as any },
      relations: ['materials']
    });
    
    if (!product) {
      throw new Error('商品不存在');
    }
    
    // 更新商品基本信息
    this.productRepository.merge(product, productData);
    
    // 如果有素材ID，更新素材关联
    if (material_ids) {
      const materials = await this.materialRepository.findBy({
        id: In(material_ids as any[])
      });
      product.materials = materials;
    }
    
    return await this.productRepository.save(product);
  }

  /**
   * 删除商品
   */
  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: id as any }
    });
    
    if (!product) {
      throw new Error('商品不存在');
    }
    
    await this.productRepository.remove(product);
  }

  /**
   * 获取单个商品
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: id as any },
      relations: ['category', 'materials']
    });
    
    if (!product) {
      throw new Error('商品不存在');
    }
    
    return product;
  }

  /**
   * 获取商品列表
   */
  async getProducts(query: ProductQueryDto): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 20, keyword, category_id, status, min_price, max_price } = query;
    
    // 构建查询条件
    const where: FindOptionsWhere<Product> = {};
    
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    
    if (category_id) {
      where.category_id = category_id as any;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (min_price !== undefined && max_price !== undefined) {
      where.price = Between(min_price, max_price) as any;
    } else if (min_price !== undefined) {
      where.price = Between(min_price, 999999999) as any;
    } else if (max_price !== undefined) {
      where.price = Between(0, max_price) as any;
    }
    
    // 查询总数
    const total = await this.productRepository.count({ where });
    
    // 查询数据
    const products = await this.productRepository.find({
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC'
      }
    });
    
    // 计算总页数
    const pages = Math.ceil(total / limit);
    
    return {
      items: products,
      meta: {
        total,
        page,
        limit,
        pages
      }
    };
  }
} 