import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/models/user.model';
import { IsString, IsInt, IsBoolean, IsOptional, IsUUID, IsEnum, Min, MaxLength } from 'class-validator';

export type AssetType = 'image' | 'audio' | 'video' | 'document' | 'other';

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    @MaxLength(100, { message: '文件名长度不能超过100个字符' })
    filename!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @MaxLength(255, { message: '原始文件名长度不能超过255个字符' })
    originalname!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @MaxLength(255, { message: '路径长度不能超过255个字符' })
    path!: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    @MaxLength(100, { message: 'MIME类型长度不能超过100个字符' })
    mimetype!: string;

    @Column({ type: 'int' })
    @IsInt()
    @Min(0, { message: '文件大小不能为负数' })
    size!: number;

    @Column({ 
        type: 'enum', 
        enum: ['image', 'audio', 'video', 'document', 'other'],
        default: 'other'
    })
    @IsEnum(['image', 'audio', 'video', 'document', 'other'], { message: '文件类型不正确' })
    type!: AssetType;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: '分类长度不能超过50个字符' })
    category?: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    is_public: boolean = false;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '上传目录长度不能超过255个字符' })
    upload_dir?: string;

    @Column({ type: 'varchar', length: 16, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(16, { message: '用户ID长度不能超过16个字符' })
    user_id?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 