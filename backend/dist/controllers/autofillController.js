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
exports.autofillForm = void 0;
const adapter_1 = require("../llm/adapter");
const data_source_1 = require("../data-source");
const Scheme_1 = require("../models/Scheme");
const autofillForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemeId, userData, language } = req.body;
        const schemeRepo = data_source_1.AppDataSource.getRepository(Scheme_1.Scheme);
        const scheme = yield schemeRepo.findOneBy({ id: schemeId });
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        const systemPrompt = `You are a form autofill assistant. Map the user data to the following JSON schema: ${JSON.stringify(scheme.template)}. Return ONLY the filled JSON. Language: ${language || 'en'}.`;
        const userPrompt = `User Data: ${JSON.stringify(userData)}`;
        const llmResponse = yield adapter_1.llmAdapter.generate({
            systemPrompt,
            userPrompt,
            temperature: 0.1, // Low temp for deterministic output
        });
        // Extract JSON from response (handle potential markdown code blocks)
        let filledData = llmResponse.content;
        if (filledData.includes('```json')) {
            filledData = filledData.split('```json')[1].split('```')[0];
        }
        else if (filledData.includes('```')) {
            filledData = filledData.split('```')[1].split('```')[0];
        }
        try {
            const parsedData = JSON.parse(filledData);
            res.json(parsedData);
        }
        catch (e) {
            console.error('Failed to parse LLM response as JSON', filledData);
            res.status(500).json({ message: 'Failed to generate valid JSON', raw: filledData });
        }
    }
    catch (error) {
        console.error('Autofill Error:', error);
        res.status(500).json({ message: 'Error processing autofill' });
    }
});
exports.autofillForm = autofillForm;
