import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { User } from './user.model';
import { Product } from './product.model';
import { BaseEntity } from './base.model';

@Entity('cart_items')
export class Cart extends BaseEntity {
  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  user_id!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  @IsString()
  @IsNotEmpty({ message: '产品ID不能为空' })
  product_id!: string;

  @Column()
  @IsNumber()
  @Min(1, { message: '数量不能小于1' })
  quantity!: number;

  constructor(partial: Partial<Cart> = {}) {
    super(partial);
  }
} 