import { IsString, IsOptional, IsNumber, Min, IsEnum, IsArray, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@/models/product.model';
import { PaginationQueryDto } from './common.dto';

/**
 * 创建商品分类 DTO
 */
export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * 更新商品分类 DTO
 */
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * 创建商品 DTO
 */
export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @IsPositive()
  stock!: number;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  material_ids?: number[];
}

/**
 * 更新商品 DTO
 */
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  material_ids?: number[];
}

/**
 * 商品查询 DTO
 */
export class ProductQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  category_id?: number;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  min_price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  max_price?: number;
} 