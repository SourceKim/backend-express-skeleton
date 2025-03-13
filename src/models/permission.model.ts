import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from '@/models/role.model';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { BaseEntity } from '@/models/base.model';

@Entity('permissions')
export class Permission extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    @IsString()
    @IsNotEmpty({ message: '权限名称不能为空' })
    @MaxLength(100, { message: '权限名称长度不能超过100个字符' })
    name!: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    @IsNotEmpty({ message: '资源名称不能为空' })
    @MaxLength(100, { message: '资源名称长度不能超过100个字符' })
    resource!: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    @IsNotEmpty({ message: '操作名称不能为空' })
    @MaxLength(100, { message: '操作名称长度不能超过100个字符' })
    action!: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description!: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles!: Role[];

    constructor(partial: Partial<Permission> = {}) {
        super(partial);
    }
} 