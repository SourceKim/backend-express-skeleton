import { IsString, IsNumber, IsOptional, Min, IsEnum, IsUrl } from 'class-validator';

enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

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

  @IsString()
  @IsUrl()
  image!: string;

  @IsString()
  category!: string;

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
  @IsString()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: string;

  constructor(partial: Partial<UpdateProductDto> = {}) {
    Object.assign(this, partial);
  }
} 