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
exports.initWorker = exports.pdfQueueName = void 0;
const bullmq_1 = require("bullmq");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("../data-source");
const Case_1 = require("../models/Case");
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
exports.pdfQueueName = 'pdf-generation';
const generatePDF = (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { caseId, formData, schemeName } = job.data;
    console.log(`Processing PDF generation for case ${caseId}`);
    try {
        const caseRepo = data_source_1.AppDataSource.getRepository(Case_1.Case);
        const caseEntity = yield caseRepo.findOneBy({ id: caseId });
        if (!caseEntity) {
            throw new Error(`Case ${caseId} not found`);
        }
        // Create PDF
        const doc = new pdfkit_1.default();
        const fileName = `application_${caseId}.pdf`;
        const filePath = path_1.default.join(__dirname, '../../uploads', fileName);
        // Ensure uploads directory exists
        const uploadsDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        const stream = fs_1.default.createWriteStream(filePath);
        doc.pipe(stream);
        // PDF Content
        doc.fontSize(20).text(`Application for ${schemeName}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Case ID: ${caseId}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text('Applicant Details:', { underline: true });
        Object.entries(formData).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`);
        });
        doc.end();
        // Wait for stream to finish
        yield new Promise((resolve, reject) => {
            stream.on('finish', () => resolve());
            stream.on('error', reject);
        });
        // Update Case with PDF URL
        caseEntity.pdfUrl = `/uploads/${fileName}`;
        caseEntity.status = Case_1.CaseStatus.IN_PROGRESS; // Move to in-progress after PDF gen
        yield caseRepo.save(caseEntity);
        console.log(`PDF generated for case ${caseId}`);
    }
    catch (error) {
        console.error(`Failed to generate PDF for case ${caseId}:`, error);
        throw error;
    }
});
const initWorker = () => {
    const worker = new bullmq_1.Worker(exports.pdfQueueName, generatePDF, {
        connection: {
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
    });
    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed!`);
    });
    worker.on('failed', (job, err) => {
        console.log(`Job ${job === null || job === void 0 ? void 0 : job.id} failed with ${err.message}`);
    });
    console.log('PDF Worker initialized');
    return worker;
};
exports.initWorker = initWorker;
