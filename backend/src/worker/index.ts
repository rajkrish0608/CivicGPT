import { initWorker as initPdfWorker } from './pdfWorker';

export const initWorkers = () => {
    initPdfWorker();
};
