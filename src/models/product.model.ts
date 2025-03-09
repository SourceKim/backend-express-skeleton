import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsNotEmpty, Min, IsEnum, IsUrl, IsOptional } from 'class-validator';

enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: '产品名称不能为空' })
  name!: string;

  @Column('text')
  @IsString()
  @IsNotEmpty({ message: '产品描述不能为空' })
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @Min(0, { message: '价格不能小于0' })
  price!: number;

  @Column()
  @IsNumber()
  @Min(0, { message: '库存不能小于0' })
  stock!: number;

  @Column()
  @IsString()
  @IsUrl({}, { message: '图片URL格式不正确' })
  image!: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: '分类不能为空' })
  category!: string; // 直接存储分类名称，不使用外键

  @Column({ default: 'active' })
  @IsEnum(ProductStatus, { message: '状态只能是active、inactive或out_of_stock' })
  status!: string; // 'active', 'inactive', 'out_of_stock'

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  constructor(partial: Partial<Product> = {}) {
    Object.assign(this, partial);
  }
} 