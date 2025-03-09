import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsEmail, Length, IsOptional, Matches, IsEnum, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Role } from '@/models/role.model';
import { Order } from '@/models/order.model';
import { Cart } from '@/models/cart.model';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Length(3, 100, { message: '用户名长度必须在3-100个字符之间' })
    username!: string;

    @Column({ type: 'varchar', length: 100, select: false }) // 默认查询时不返回密码
    @MinLength(6, { message: '密码长度不能少于6个字符' })
    password!: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    @Length(2, 100, { message: '昵称长度必须在2-100个字符之间' })
    nickname?: string;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    @IsOptional()
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
    phone?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    avatar?: string;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    @IsEnum(UserStatus, { message: '用户状态不正确' })
    status!: UserStatus;

    @Column({ type: 'varchar', length: 500, nullable: true })
    @IsOptional()
    @Length(0, 500, { message: '简介长度不能超过500个字符' })
    bio?: string; // 用户简介

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at!: Date;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        }
    })
    roles!: Role[];

    @OneToMany(() => Order, order => order.user)
    orders!: Order[];

    @OneToMany(() => Cart, cart => cart.user)
    carts!: Cart[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    constructor(partial: Partial<User> = {}) {
        Object.assign(this, partial);
    }
} 