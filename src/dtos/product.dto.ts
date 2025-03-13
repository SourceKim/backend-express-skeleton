import { IsString, IsNumber, IsOptional, Min, IsEnum, IsUrl, IsUUID, IsArray, ArrayMinSize } from 'class-validator';

enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

// 分类相关 DTO
export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  parent_id?: string;

  constructor(partial: Partial<CreateCategoryDto> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  parent_id?: string;

  constructor(partial: Partial<UpdateCategoryDto> = {}) {
    Object.assign(this, partial);
  }
}

// 产品相关 DTO
export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsArray()
  @ArrayMinSize(1, { message: '至少需要一个素材图片' })
  @IsUUID('all', { each: true, message: '素材ID必须是有效的UUID' })
  images!: string[];

  @IsString()
  @IsUUID()
  category_id!: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: string;

  constructor(partial: Partial<CreateProductDto> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要一个素材图片' })
  @IsUUID('all', { each: true, message: '素材ID必须是有效的UUID' })
  images?: string[];

  @IsOptional()
  @IsString()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: string;

  constructor(partial: Partial<UpdateProductDto> = {}) {
    Object.assign(this, partial);
  }
} 