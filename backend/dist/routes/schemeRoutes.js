"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemeController_1 = require("../controllers/schemeController");
const router = (0, express_1.Router)();
router.get('/', schemeController_1.getSchemes);
exports.default = router;
