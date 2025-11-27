import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Scheme } from '../models/Scheme';

export const getSchemes = async (req: Request, res: Response) => {
    try {
        const schemeRepo = AppDataSource.getRepository(Scheme);
        const schemes = await schemeRepo.find();
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schemes', error });
    }
};
