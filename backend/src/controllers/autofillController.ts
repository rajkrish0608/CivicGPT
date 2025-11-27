import { Request, Response } from 'express';
import { llmAdapter } from '../llm/adapter';
import { AppDataSource } from '../data-source';
import { Scheme } from '../models/Scheme';

export const autofillForm = async (req: Request, res: Response) => {
    try {
        const { schemeId, userData, language } = req.body;
        const schemeRepo = AppDataSource.getRepository(Scheme);
        const scheme = await schemeRepo.findOneBy({ id: schemeId });

        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        const systemPrompt = `You are a form autofill assistant. Map the user data to the following JSON schema: ${JSON.stringify(scheme.template)}. Return ONLY the filled JSON. Language: ${language || 'en'}.`;
        const userPrompt = `User Data: ${JSON.stringify(userData)}`;

        const llmResponse = await llmAdapter.generate({
            systemPrompt,
            userPrompt,
            temperature: 0.1, // Low temp for deterministic output
        });

        // Extract JSON from response (handle potential markdown code blocks)
        let filledData = llmResponse.content;
        if (filledData.includes('```json')) {
            filledData = filledData.split('```json')[1].split('```')[0];
        } else if (filledData.includes('```')) {
            filledData = filledData.split('```')[1].split('```')[0];
        }

        try {
            const parsedData = JSON.parse(filledData);
            res.json(parsedData);
        } catch (e) {
            console.error('Failed to parse LLM response as JSON', filledData);
            res.status(500).json({ message: 'Failed to generate valid JSON', raw: filledData });
        }
    } catch (error) {
        console.error('Autofill Error:', error);
        res.status(500).json({ message: 'Error processing autofill' });
    }
};
