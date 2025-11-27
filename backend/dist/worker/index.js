"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorkers = void 0;
const pdfWorker_1 = require("./pdfWorker");
const initWorkers = () => {
    (0, pdfWorker_1.initWorker)();
};
exports.initWorkers = initWorkers;
