import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/models/user.model';

@Entity('user_settings')
export class UserSettings {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @OneToOne(() => User)
    @JoinColumn()
    user!: User;

    @Column({ type: 'varchar', length: 20, default: 'light' })
    theme!: string;

    @Column({ type: 'varchar', length: 10, default: 'zh-CN' })
    language!: string;

    @Column({ type: 'boolean', default: true })
    notifications!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;
} 