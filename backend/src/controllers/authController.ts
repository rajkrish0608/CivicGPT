import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, language } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const existingUser = await userRepo.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = userRepo.create({ email, password, language }); // In prod, hash password!
        await userRepo.save(user);

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOne({ where: { email }, select: ['id', 'email', 'password', 'role', 'language'] });
        if (!user || user.password !== password) { // In prod, compare hash!
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
