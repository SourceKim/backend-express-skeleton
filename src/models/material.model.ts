import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '@/models/user.model';
import { IsString, IsInt, IsBoolean, IsOptional, IsUUID, IsEnum, Min, MaxLength } from 'class-validator';

/**
 * 素材类型枚举
 * image: 图片素材
 * audio: 音频素材
 * video: 视频素材
 * document: 文档素材
 * text: 纯文本素材
 * other: 其他类型素材
 */
export type MaterialType = 'image' | 'audio' | 'video' | 'document' | 'text' | 'other';

/**
 * 素材实体类
 * 用于管理各种类型的素材，包括图片、音频、视频、文档、文本等
 */
@Entity('materials')
export class Material {
    /**
     * 素材唯一标识符
     */
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    /**
     * 素材文件名
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: '文件名长度不能超过100个字符' })
    filename?: string;

    /**
     * 素材原始文件名
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '原始文件名长度不能超过255个字符' })
    originalname?: string;

    /**
     * 素材存储路径
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '路径长度不能超过255个字符' })
    path?: string;

    /**
     * 素材MIME类型
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'MIME类型长度不能超过100个字符' })
    mimetype?: string;

    /**
     * 素材文件大小（字节）
     * 对于文本类型素材，表示文本长度
     */
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0, { message: '文件大小不能为负数' })
    size?: number;

    /**
     * 素材类型
     * image: 图片素材
     * audio: 音频素材
     * video: 视频素材
     * document: 文档素材
     * text: 纯文本素材
     * other: 其他类型素材
     */
    @Column({ 
        type: 'enum', 
        enum: ['image', 'audio', 'video', 'document', 'text', 'other'],
        default: 'other'
    })
    @IsEnum(['image', 'audio', 'video', 'document', 'text', 'other'], { message: '素材类型不正确' })
    type!: MaterialType;

    /**
     * 素材分类
     * 用于对素材进行分类管理
     */
    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: '分类长度不能超过50个字符' })
    category?: string;

    /**
     * 素材描述
     * 对于文本类型素材，此字段存储文本内容
     */
    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    /**
     * 素材是否公开
     * true: 公开可访问
     * false: 需要权限访问
     */
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    is_public: boolean = false;

    /**
     * 素材上传目录
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '上传目录长度不能超过255个字符' })
    upload_dir?: string;

    /**
     * 素材所属用户
     * 通过外键关联到用户表
     */
    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    /**
     * 素材标签
     * 以JSON数组形式存储
     */
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    tags?: string[];

    /**
     * 素材元数据
     * 以JSON对象形式存储额外信息
     */
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    metadata?: Record<string, any>;

    /**
     * 父素材ID
     * 用于版本管理，指向原始素材
     */
    @Column({ type: 'varchar', length: 36, nullable: true })
    @IsOptional()
    @IsString()
    parent_id?: string;

    /**
     * 关联的素材列表
     * 用于关联到其他素材
     */
    @OneToMany(() => Material, material => material.parent_id)
    related_materials?: Material[];

    /**
     * 素材创建时间
     * 自动生成
     */
    @CreateDateColumn()
    created_at!: Date;

    /**
     * 素材更新时间
     * 自动更新
     */
    @UpdateDateColumn()
    updated_at!: Date;
} 