import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '@/models/user.model';
import { IsString, IsInt, IsBoolean, IsOptional, IsUUID, IsEnum, Min, MaxLength } from 'class-validator';
import { BaseEntity } from '@/models/base.model';
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
 * 素材分类实体
 * 用于管理素材的分类
 */
@Entity('material_categories')
export class MaterialCategory extends BaseEntity {
    /**
     * 分类名称
     */
    @Column({ type: 'varchar', length: 50, unique: true })
    @IsString()
    @MaxLength(50, { message: '分类名称不能超过50个字符' })
    name!: string;

    /**
     * 分类描述
     */
    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200, { message: '分类描述不能超过200个字符' })
    description?: string;

    /**
     * 该分类下的所有素材
     */
    @OneToMany(() => Material, material => material.materialCategory)
    materials!: Material[];

    constructor(partial: Partial<MaterialCategory> = {}) {
        super(partial);
    }
}

/**
 * 素材标签实体
 * 用于管理素材的标签
 */
@Entity('material_tags')
export class MaterialTag extends BaseEntity {
    /**
     * 标签名称
     */
    @Column({ type: 'varchar', length: 50, unique: true })
    @IsString()
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name!: string;

    /**
     * 标签描述
     */
    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200, { message: '标签描述不能超过200个字符' })
    description?: string;

    /**
     * 使用该标签的素材
     */
    @ManyToMany(() => Material, material => material.materialTags)
    materials!: Material[];

    constructor(partial: Partial<MaterialTag> = {}) {
        super(partial);
    }
}

/**
 * 素材实体类
 * 用于管理各种类型的素材，包括图片、音频、视频、文档、文本等
 */
@Entity('materials')
export class Material extends BaseEntity {
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
     * @deprecated 使用materialCategory替代
     */
    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: '分类长度不能超过50个字符' })
    category?: string;

    /**
     * 素材分类关联
     * 通过外键关联到分类表
     */
    @ManyToOne(() => MaterialCategory, category => category.materials, { nullable: true })
    @JoinColumn({ name: 'material_category_id' })
    materialCategory?: MaterialCategory;

    @Column({ name: 'material_category_id', type: 'varchar', length: 36, nullable: true })
    @IsOptional()
    @IsString()
    materialCategoryId?: string;

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
     * @deprecated 使用materialTags替代
     */
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    tags?: string[];

    /**
     * 素材标签关联
     * 通过多对多关系关联到标签表
     */
    @ManyToMany(() => MaterialTag, tag => tag.materials)
    @JoinTable({
        name: 'material_to_tags',
        joinColumn: {
            name: 'material_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id'
        }
    })
    materialTags?: MaterialTag[];

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

    constructor(partial: Partial<Material> = {}) {
        super(partial);
    }
} 