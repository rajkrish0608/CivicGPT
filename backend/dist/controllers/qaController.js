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
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = void 0;
const adapter_1 = require("../llm/adapter");
const connector_1 = require("../nlu/connector");
const data_source_1 = require("../data-source");
const Feedback_1 = require("../models/Feedback");
const askQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { query, language } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // 1. NLU Analysis
        const nluResult = yield connector_1.nluConnector.parse(query, language);
        // 2. LLM Generation
        const systemPrompt = `You are an Indian government assistant. Answer in ${language}. Intent: ${nluResult.intent}. Context: ${JSON.stringify(nluResult.slots)}`;
        const llmResponse = yield adapter_1.llmAdapter.generate({
            systemPrompt,
            userPrompt: query,
        });
        // 3. Store Feedback/History
        if (userId) {
            const feedbackRepo = data_source_1.AppDataSource.getRepository(Feedback_1.Feedback);
            const feedback = feedbackRepo.create({
                userId,
                query,
                response: llmResponse.content,
            });
            yield feedbackRepo.save(feedback);
        }
        res.json({
            answer: llmResponse.content,
            intent: nluResult.intent,
            slots: nluResult.slots,
        });
    }
    catch (error) {
        console.error('QA Error:', error);
        res.status(500).json({ message: 'Error processing query' });
    }
});
exports.askQuestion = askQuestion;
