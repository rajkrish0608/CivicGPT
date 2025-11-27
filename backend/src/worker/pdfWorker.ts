import { Worker, Job } from 'bullmq';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { Case, CaseStatus } from '../models/Case';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const pdfQueueName = 'pdf-generation';

const generatePDF = async (job: Job) => {
    const { caseId, formData, schemeName } = job.data;
    console.log(`Processing PDF generation for case ${caseId}`);

    try {
        const caseRepo = AppDataSource.getRepository(Case);
        const caseEntity = await caseRepo.findOneBy({ id: caseId });

        if (!caseEntity) {
            throw new Error(`Case ${caseId} not found`);
        }

        // Create PDF
        const doc = new PDFDocument();
        const fileName = `application_${caseId}.pdf`;
        const filePath = path.join(__dirname, '../../uploads', fileName);

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
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
        await new Promise<void>((resolve, reject) => {
            stream.on('finish', () => resolve());
            stream.on('error', reject);
        });

        // Update Case with PDF URL
        caseEntity.pdfUrl = `/uploads/${fileName}`;
        caseEntity.status = CaseStatus.IN_PROGRESS; // Move to in-progress after PDF gen
        await caseRepo.save(caseEntity);

        console.log(`PDF generated for case ${caseId}`);
    } catch (error) {
        console.error(`Failed to generate PDF for case ${caseId}:`, error);
        throw error;
    }
};

export const initWorker = () => {
    const worker = new Worker(
        pdfQueueName,
        generatePDF,
        {
            connection: {
                host: REDIS_HOST,
                port: REDIS_PORT,
            },
        }
    );

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} failed with ${err.message}`);
    });

    console.log('PDF Worker initialized');
    return worker;
};
