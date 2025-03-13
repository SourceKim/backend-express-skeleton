import { Entity, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.model';
import { Material } from './material.model';

/**
 * 商品分类实体
 */
@Entity('mall_product_category')
export class Category extends BaseEntity {
  @Column({ length: 50, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(() => Product, product => product.category)
  products!: Product[];
}

/**
 * 商品状态枚举
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

/**
 * 商品实体
 */
@Entity('mall_product')
export class Product extends BaseEntity {
  @Column({ length: 100, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({ type: 'int', nullable: false })
  stock!: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
    nullable: false
  })
  status!: ProductStatus;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ nullable: true })
  category_id!: number;

  @ManyToMany(() => Material)
  @JoinTable({
    name: 'mall_product_materials',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'material_id', referencedColumnName: 'id' }
  })
  materials!: Material[];
} 