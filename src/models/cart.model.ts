import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.model';
import { User } from './user.model';
import { Product } from './product.model';

/**
 * 购物车实体
 */
@Entity('mall_cart')
export class Cart extends BaseEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 36, nullable: false })
  user_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  total_price!: number;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  items!: CartItem[];
}

/**
 * 购物车项实体
 */
@Entity('mall_cart_item')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'varchar', length: 36, nullable: false })
  product_id!: string;

  @ManyToOne(() => Cart, cart => cart.items, { nullable: false })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @Column({ type: 'varchar', length: 36, nullable: false })
  cart_id!: string;

  @Column({ type: 'int', nullable: false })
  quantity!: number;
} 