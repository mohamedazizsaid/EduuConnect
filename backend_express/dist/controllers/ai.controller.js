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
exports.evaluateAssignment = exports.getRecommendations = void 0;
const axios_1 = __importDefault(require("axios"));
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${AI_SERVICE_URL}/recommendations`, req.body);
        res.json(response.data);
    }
    catch (e) {
        res.status(500).json({ error: 'AI Service unavailable' });
    }
});
exports.getRecommendations = getRecommendations;
const evaluateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { submission, context } = req.body; // context might define simple rubrics or answer key
        const response = yield axios_1.default.post(`${AI_SERVICE_URL}/evaluate`, { submission, context });
        res.json(response.data);
    }
    catch (e) {
        res.status(500).json({ error: 'AI Service unavailable' });
    }
});
exports.evaluateAssignment = evaluateAssignment;
