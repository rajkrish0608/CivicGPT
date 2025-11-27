import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Case, CaseStatus } from '../models/Case';
import { AuthRequest } from '../middleware/auth';
import { pdfQueueName } from '../worker/pdfWorker';
import { Queue } from 'bullmq';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

const pdfQueue = new Queue(pdfQueueName, {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
});

export const createCase = async (req: AuthRequest, res: Response) => {
    try {
        const { schemeId, formData, schemeName } = req.body;
        const userId = req.user!.userId;
        const caseRepo = AppDataSource.getRepository(Case);

        const newCase = caseRepo.create({
            userId,
            schemeId,
            formData,
            status: CaseStatus.PENDING,
        });

        await caseRepo.save(newCase);

        // Trigger PDF Generation
        await pdfQueue.add('generate-pdf', {
            caseId: newCase.id,
            formData,
            schemeName,
        });

        res.status(201).json(newCase);
    } catch (error) {
        res.status(500).json({ message: 'Error creating case', error });
    }
};

export const getCases = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const caseRepo = AppDataSource.getRepository(Case);
        const cases = await caseRepo.find({
            where: { userId },
            relations: ['scheme'],
            order: { createdAt: 'DESC' },
        });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error });
    }
};

export const getAllCases = async (req: AuthRequest, res: Response) => {
    try {
        const caseRepo = AppDataSource.getRepository(Case);
        const cases = await caseRepo.find({
            relations: ['user', 'scheme'],
            order: { createdAt: 'DESC' },
        });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all cases', error });
    }
};

export const updateCaseStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const caseRepo = AppDataSource.getRepository(Case);

        await caseRepo.update(id, { status });
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};
