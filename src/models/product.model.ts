import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { IsString, IsNumber, IsNotEmpty, Min, IsEnum, IsUrl, IsOptional, IsUUID, IsArray } from 'class-validator';
import { Material } from './material.model';
import { BaseEntity } from './base.model';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

@Entity('product_categories')
export class Category extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  name!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ nullable: true })
  @IsUUID()
  @IsOptional()
  parent_id?: string;

  @ManyToOne(() => Category, category => category.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  @OneToMany(() => Category, category => category.parent)
  children?: Category[];

  @OneToMany(() => Product, product => product.category)
  products?: Product[];

  constructor(partial: Partial<Category> = {}) {
    super(partial);
  }
}

@Entity('products')
export class Product extends BaseEntity {
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

  @ManyToMany(() => Material)
  @JoinTable({
    name: 'product_materials',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'material_id',
      referencedColumnName: 'id'
    }
  })
  images!: Material[];

  @Column()
  @IsUUID()
  @IsNotEmpty({ message: '分类ID不能为空' })
  category_id!: string;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ default: 'active' })
  @IsEnum(ProductStatus, { message: '状态只能是active、inactive或out_of_stock' })
  status!: string;

  constructor(partial: Partial<Product> = {}) {
    super(partial);
  }
} 