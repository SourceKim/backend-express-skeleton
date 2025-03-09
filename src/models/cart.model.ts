import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { User } from './user.model';
import { Product } from './product.model';

@Entity('cart_items')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.carts)
  user!: User;

  @Column({ name: 'user_id' })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId!: string;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ name: 'product_id' })
  @IsString()
  @IsNotEmpty({ message: '产品ID不能为空' })
  productId!: string;

  @Column()
  @IsNumber()
  @Min(1, { message: '数量不能小于1' })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  constructor(partial: Partial<Cart> = {}) {
    Object.assign(this, partial);
  }
} 