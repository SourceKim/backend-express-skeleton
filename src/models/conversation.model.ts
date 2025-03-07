import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Chat } from '@/models/chat.model';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', name: 'user_id', nullable: false, length: 16 })
    userId!: string;

    @Column({ type: 'varchar', name: 'last_chat_id', nullable: true, length: 36 })
    last_chat_id!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at!: Date;

    @OneToMany(() => Chat, (chat) => chat.conversation)
    chats!: Chat[];

    constructor(partial: Partial<Conversation> = {}) {
        Object.assign(this, partial);
    }
} 