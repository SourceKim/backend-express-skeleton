import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '@/models/permission.model';
import { User } from '@/models/user.model';
import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';
import { BaseEntity } from '@/models/base.model';

@Entity('roles')
export class Role extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    @IsString()
    @IsNotEmpty({ message: '角色名称不能为空' })
    @MaxLength(100, { message: '角色名称长度不能超过100个字符' })
    name!: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description!: string;

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions!: Permission[];

    @ManyToMany(() => User, user => user.roles)
    users!: User[];

    constructor(partial: Partial<Role> = {}) {
        super(partial);
    }
} 