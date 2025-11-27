import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Scheme {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('jsonb')
    template: any; // JSON structure for the form fields

    @Column('text', { nullable: true })
    htmlTemplate: string; // HTML template for PDF generation

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
