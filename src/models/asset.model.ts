import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/models/user.model';

export type AssetType = 'image' | 'audio' | 'video' | 'document' | 'other';

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    filename!: string;

    @Column({ type: 'varchar', length: 255 })
    originalname!: string;

    @Column({ type: 'varchar', length: 255 })
    path!: string;

    @Column({ type: 'varchar', length: 100 })
    mimetype!: string;

    @Column({ type: 'int' })
    size!: number;

    @Column({ 
        type: 'enum', 
        enum: ['image', 'audio', 'video', 'document', 'other'],
        default: 'other'
    })
    type!: AssetType;

    @Column({ type: 'varchar', length: 50, nullable: true })
    category?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'boolean', default: false })
    is_public: boolean = false;

    @Column({ type: 'varchar', length: 255, nullable: true })
    upload_dir?: string;

    @Column({ type: 'varchar', length: 16, nullable: true })
    user_id?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 