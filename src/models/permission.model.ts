import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from '@/models/role.model';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'varchar', length: 100 })
    resource!: string;

    @Column({ type: 'varchar', length: 100 })
    action!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles!: Role[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at!: Date;

    constructor(partial: Partial<Permission> = {}) {
        Object.assign(this, partial);
    }
} 