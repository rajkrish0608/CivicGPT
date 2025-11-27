"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autofillController_1 = require("../controllers/autofillController");
// import { authenticate } from '../middleware/auth';
const router = (0, express_1.Router)();
router.post('/', autofillController_1.autofillForm); // Can be protected if needed
exports.default = router;
