"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qaController_1 = require("../controllers/qaController");
// import { authenticate } from '../middleware/auth'; // TODO: Add auth middleware
const router = (0, express_1.Router)();
// Public or Protected? Let's make it public for now, but optional auth in controller
router.post('/ask', qaController_1.askQuestion);
exports.default = router;
