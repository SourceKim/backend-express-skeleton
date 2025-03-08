import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from '@/models/role.model';
import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

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

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at!: Date;

    constructor(partial: Partial<Permission> = {}) {
        Object.assign(this, partial);
    }
} 