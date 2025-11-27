"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmAdapter = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class LLMAdapter {
    constructor() {
        this.openai = null;
        this.provider = process.env.LLM_PROVIDER || 'mock';
        if (this.provider === 'openai') {
            this.openai = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
    }
    generate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.provider === 'openai' && this.openai) {
                return this.generateOpenAI(request);
            }
            else {
                return this.generateMock(request);
            }
        });
    }
    generateOpenAI(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completion = yield this.openai.chat.completions.create({
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
            }
            catch (error) {
                console.error('OpenAI API Error:', error);
                throw new Error('Failed to generate response from OpenAI');
            }
        });
    }
    generateMock(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate network delay
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Mock LLM Request:', request);
            return {
                content: `[MOCK RESPONSE] Based on your query "${request.userPrompt}", here is the information you requested. This is a placeholder response from the mock adapter.`,
            };
        });
    }
}
exports.llmAdapter = new LLMAdapter();
