import { Request, Response } from 'express';
import { llmAdapter } from '../llm/adapter';
import { nluConnector } from '../nlu/connector';
import { AppDataSource } from '../data-source';
import { Feedback } from '../models/Feedback';

export const askQuestion = async (req: Request, res: Response) => {
    try {
        const { query, language } = req.body;
        const userId = (req as any).user?.userId;

        // 1. NLU Analysis
        const nluResult = await nluConnector.parse(query, language);

        // 2. LLM Generation
        const systemPrompt = `You are an Indian government assistant. Answer in ${language}. Intent: ${nluResult.intent}. Context: ${JSON.stringify(nluResult.slots)}`;
        const llmResponse = await llmAdapter.generate({
            systemPrompt,
            userPrompt: query,
        });

        // 3. Store Feedback/History
        if (userId) {
            const feedbackRepo = AppDataSource.getRepository(Feedback);
            const feedback = feedbackRepo.create({
                userId,
                query,
                response: llmResponse.content,
            });
            await feedbackRepo.save(feedback);
        }

        res.json({
            answer: llmResponse.content,
            intent: nluResult.intent,
            slots: nluResult.slots,
        });
    } catch (error) {
        console.error('QA Error:', error);
        res.status(500).json({ message: 'Error processing query' });
    }
};
