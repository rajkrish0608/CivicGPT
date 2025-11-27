import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    CITIZEN = 'citizen',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Don't return password by default
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CITIZEN,
    })
    role: UserRole;

    @Column({ default: 'en' })
    language: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
