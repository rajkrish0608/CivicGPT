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
exports.updateCaseStatus = exports.getAllCases = exports.getCases = exports.createCase = void 0;
const data_source_1 = require("../data-source");
const Case_1 = require("../models/Case");
const pdfWorker_1 = require("../worker/pdfWorker");
const bullmq_1 = require("bullmq");
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const pdfQueue = new bullmq_1.Queue(pdfWorker_1.pdfQueueName, {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
});
const createCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schemeId, formData, schemeName } = req.body;
        const userId = req.user.userId;
        const caseRepo = data_source_1.AppDataSource.getRepository(Case_1.Case);
        const newCase = caseRepo.create({
            userId,
            schemeId,
            formData,
            status: Case_1.CaseStatus.PENDING,
        });
        yield caseRepo.save(newCase);
        // Trigger PDF Generation
        yield pdfQueue.add('generate-pdf', {
            caseId: newCase.id,
            formData,
            schemeName,
        });
        res.status(201).json(newCase);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating case', error });
    }
});
exports.createCase = createCase;
const getCases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const caseRepo = data_source_1.AppDataSource.getRepository(Case_1.Case);
        const cases = yield caseRepo.find({
            where: { userId },
            relations: ['scheme'],
            order: { createdAt: 'DESC' },
        });
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cases', error });
    }
});
exports.getCases = getCases;
const getAllCases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caseRepo = data_source_1.AppDataSource.getRepository(Case_1.Case);
        const cases = yield caseRepo.find({
            relations: ['user', 'scheme'],
            order: { createdAt: 'DESC' },
        });
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching all cases', error });
    }
});
exports.getAllCases = getAllCases;
const updateCaseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const caseRepo = data_source_1.AppDataSource.getRepository(Case_1.Case);
        yield caseRepo.update(id, { status });
        res.json({ message: 'Status updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
});
exports.updateCaseStatus = updateCaseStatus;
