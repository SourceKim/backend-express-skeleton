import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/models/user.model';
import { Asset } from '@/models/asset.model';

// 冥想素材类型
export type MeditationMaterialType = 'audio' | 'image' | 'text' | 'video';

// 冥想素材模型
@Entity('meditation_materials')
export class MeditationMaterial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: ['audio', 'image', 'text', 'video'] })
  type!: MeditationMaterialType;

  @Column({ name: 'asset_id', type: 'uuid', nullable: true })
  assetId!: string | null;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'int', nullable: true })
  duration!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
  
  @ManyToOne(() => Asset, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;
}

// 冥想记录状态
export type MeditationStatus = 'start' | 'completed' | 'cancelled';

// 冥想记录模型
@Entity('meditation_records')
export class MeditationRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 16 })
  userId!: string;

  @Column({ type: 'json' })
  materials!: string[];

  @Column({ 
    type: 'enum', 
    enum: ['start', 'completed', 'cancelled'],
    default: 'start'
  })
  status!: MeditationStatus;

  @Column({ name: 'start_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime!: Date | null;

  @Column({ type: 'int', nullable: true })
  duration!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor() {
    this.materials = [];  // 在构造函数中设置默认值
  }
} 