import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsNotEmpty, Min, IsEnum, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.model';

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

class OrderProduct {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  image!: string;
}

class OrderAddress {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_no' })
  @IsString()
  @IsNotEmpty({ message: '订单编号不能为空' })
  orderNo!: string;

  @ManyToOne(() => User, user => user.orders)
  user!: User;

  @Column({ name: 'user_id' })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId!: string; // 修改为string类型，与User.id保持一致

  @Column('json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProduct)
  products!: OrderProduct[];

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  @IsNumber()
  @Min(0, { message: '订单金额不能小于0' })
  totalAmount!: number;

  @Column({ default: 'pending' })
  @IsEnum(OrderStatus, { message: '订单状态不正确' })
  status!: string; // 'pending', 'paid', 'shipped', 'completed', 'cancelled'

  @Column('json')
  @IsObject()
  @ValidateNested()
  @Type(() => OrderAddress)
  address!: OrderAddress;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, partial);
  }
} 