import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Scheme } from './Scheme';

export enum CaseStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity()
export class Case {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    schemeId: string;

    @ManyToOne(() => Scheme)
    @JoinColumn({ name: 'schemeId' })
    scheme: Scheme;

    @Column({
        type: 'enum',
        enum: CaseStatus,
        default: CaseStatus.PENDING,
    })
    status: CaseStatus;

    @Column('jsonb')
    formData: any; // The data filled by the user

    @Column({ nullable: true })
    pdfUrl: string; // Path to the generated PDF

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
