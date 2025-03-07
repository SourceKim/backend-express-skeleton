import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sutras')
export class Sutra {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    title!: string;

    @Column({ type: 'varchar', length: 50 })
    category!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'longtext' })
    content!: string;

    @Column({ type: 'int', default: 0 })
    read_count: number = 0;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    constructor() {
        this.read_count = 0;
    }
} 