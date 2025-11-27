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
exports.nluConnector = exports.NLUConnector = void 0;
class NLUConnector {
    parse(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, language = 'en') {
            // Mock NLU logic
            // In production, this would call a Rasa server
            console.log(`NLU Parsing (${language}): ${text}`);
            const lowerText = text.toLowerCase();
            let intent = 'nlu_fallback';
            const slots = {};
            if (lowerText.includes('ration') || lowerText.includes('food')) {
                intent = 'ask_scheme_details';
                slots.scheme = 'Ration Card';
            }
            else if (lowerText.includes('apply') || lowerText.includes('form')) {
                intent = 'apply_scheme';
                if (lowerText.includes('ration'))
                    slots.scheme = 'Ration Card';
            }
            else if (lowerText.includes('status') || lowerText.includes('track')) {
                intent = 'check_status';
            }
            return {
                intent,
                confidence: 0.9,
                slots,
            };
        });
    }
}
exports.NLUConnector = NLUConnector;
exports.nluConnector = new NLUConnector();
