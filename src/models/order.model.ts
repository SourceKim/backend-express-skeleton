import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.model';
import { User } from './user.model';
import { Product } from './product.model';

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded'
}

/**
 * 订单实体
 */
@Entity('mall_order')
export class Order extends BaseEntity {
  @Column({ length: 36, nullable: false, unique: true })
  order_number!: string;

  @Column({ type: 'text', nullable: true })
  remark!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 36, nullable: false })
  user_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_price!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false
  })
  status!: OrderStatus;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items!: OrderItem[];
}

/**
 * 订单项实体
 */
@Entity('mall_order_item')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'varchar', length: 36, nullable: false })
  product_id!: string;

  @ManyToOne(() => Order, order => order.items, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ type: 'varchar', length: 36, nullable: false })
  order_id!: string;

  @Column({ type: 'int', nullable: false })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;
} 