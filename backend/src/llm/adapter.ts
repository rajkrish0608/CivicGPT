import OpenAI from 'openai';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export interface LLMRequest {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
}

export interface LLMResponse {
    content: string;
    usage?: any;
}

class LLMAdapter {
    private provider: string;
    private openai: OpenAI | null = null;
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        this.provider = process.env.LLM_PROVIDER || 'mock';
        console.log('LLMAdapter Initialized. Provider:', this.provider);
        console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

        if (this.provider === 'openai') {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        } else if (this.provider === 'gemini') {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
            console.log('Gemini initialized:', !!this.genAI);
        }
    }

    async generate(request: LLMRequest): Promise<LLMResponse> {
        console.log('Generating with provider:', this.provider);
        if (this.provider === 'openai' && this.openai) {
            return this.generateOpenAI(request);
        } else if (this.provider === 'gemini' && this.genAI) {
            return this.generateGemini(request);
        } else {
            console.log('Falling back to Mock. genAI exists?', !!this.genAI);
            return this.generateMock(request);
        }
    }

    private async generateGemini(request: LLMRequest): Promise<LLMResponse> {
        try {
            const model = this.genAI!.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `${request.systemPrompt}\n\nUser: ${request.userPrompt}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                content: text,
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to generate response from Gemini');
        }
    }

    private async generateOpenAI(request: LLMRequest): Promise<LLMResponse> {
        try {
            const completion = await this.openai!.chat.completions.create({
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt },
                ],
                model: 'gpt-3.5-turbo',
                temperature: request.temperature || 0.7,
            });

            return {
                content: completion.choices[0].message.content || '',
                usage: completion.usage,
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to generate response from OpenAI');
        }
    }

    private async generateMock(request: LLMRequest): Promise<LLMResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Mock LLM Request:', request);

        return {
            content: `[MOCK RESPONSE] Based on your query "${request.userPrompt}", here is the information you requested. This is a placeholder response from the mock adapter.`,
        };
    }
}

export const llmAdapter = new LLMAdapter();
