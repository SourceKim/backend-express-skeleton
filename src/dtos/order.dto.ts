import { IsString, IsObject, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;

  constructor(partial: Partial<AddressDto> = {}) {
    Object.assign(this, partial);
  }
}

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class CreateOrderDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  constructor(partial: Partial<CreateOrderDto> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: string;

  constructor(partial: Partial<UpdateOrderStatusDto> = {}) {
    Object.assign(this, partial);
  }
} 