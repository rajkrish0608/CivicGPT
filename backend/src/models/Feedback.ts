import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('text')
    query: string;

    @Column('text')
    response: string;

    @Column({ nullable: true })
    rating: number; // 1-5

    @Column({ default: false })
    flagged: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
