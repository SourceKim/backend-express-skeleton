import { IsString, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested, IsInt, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@/models/order.model';
import { PaginationQueryDto } from './common.dto';

/**
 * 订单项 DTO
 */
export class OrderItemDto {
  @IsInt()
  @IsPositive()
  product_id!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

/**
 * 创建订单 DTO
 */
export class CreateOrderDto {
  @IsString()
  @IsOptional()
  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

/**
 * 更新订单状态 DTO
 */
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsString()
  @IsOptional()
  remark?: string;
}

/**
 * 订单查询 DTO
 */
export class OrderQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  order_number?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  user_id?: number;

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  min_price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  max_price?: number;
} 