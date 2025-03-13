import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/models/user.model';
import { IsString, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { BaseEntity } from '@/models/base.model';

@Entity('user_settings')
export class UserSettings extends BaseEntity {

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 20, default: 'light' })
    @IsString()
    @IsNotEmpty({ message: '主题不能为空' })
    theme!: string;

    @Column({ type: 'varchar', length: 10, default: 'zh-CN' })
    @IsString()
    @IsNotEmpty({ message: '语言不能为空' })
    language!: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    notifications_enabled!: boolean;
} 