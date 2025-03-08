import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/models/user.model';
import { IsString, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

@Entity('user_settings')
export class UserSettings {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

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

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;
} 