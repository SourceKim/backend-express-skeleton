import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from '@/models/conversation.model';

export enum ChatStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', name: 'conversation_id', nullable: false, length: 36 })
    conversationId!: string;

    @Column({ type: 'varchar', name: 'user_id', nullable: false, length: 16 })
    userId!: string;

    @Column({ type: 'text', name: 'question_content', nullable: false })
    questionContent!: string;

    @Column({ type: 'varchar', name: 'question_content_type', default: 'text', length: 20 })
    questionContentType!: string;

    @Column({ type: 'text', name: 'answer_content', nullable: true })
    answerContent!: string;

    @Column({ type: 'varchar', name: 'answer_content_type', default: 'text', nullable: true, length: 20 })
    answerContentType!: string;

    @Column({
        type: 'enum',
        enum: ChatStatus,
        default: ChatStatus.IN_PROGRESS
    })
    status!: ChatStatus;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => Conversation, (conversation) => conversation.chats, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'conversation_id' })
    conversation!: Conversation;

    constructor(partial: Partial<Chat> = {}) {
        Object.assign(this, partial);
    }
} 