import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/models/user.model';
import { Asset } from '@/models/asset.model';

// 上香素材类型
export type WorshipMaterialType = 'incense_burner' | 'incense' | 'buddha' | 'wish';

// 上香素材模型
@Entity('worship_materials')
export class WorshipMaterial {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ 
        type: 'enum', 
        enum: ['incense_burner', 'incense', 'buddha', 'wish'] 
    })
    type!: WorshipMaterialType;

    @Column({ name: 'asset_id', type: 'uuid', nullable: true })
    assetId!: string | null;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date;
    
    @ManyToOne(() => Asset, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'asset_id' })
    asset?: Asset;
}

// 上香记录模型
@Entity('worship_records')
export class WorshipRecord {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'varchar', length: 16 })
    userId!: string;

    @Column({ name: 'buddha_id', type: 'varchar', length: 36 })
    buddhaId!: string;

    @Column({ type: 'json' })
    materials!: string[];

    @Column({ type: 'text', nullable: true })
    wish!: string | null;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => WorshipMaterial, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'buddha_id' })
    buddha!: WorshipMaterial;

    constructor() {
        this.materials = [];  // 在构造函数中设置默认值
    }
} 