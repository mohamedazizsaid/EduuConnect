"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.post('/recommendations', ai_controller_1.getRecommendations);
router.post('/evaluate', ai_controller_1.evaluateAssignment);
exports.default = router;
