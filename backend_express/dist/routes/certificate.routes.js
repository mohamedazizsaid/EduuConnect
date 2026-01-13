"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificate_controller_1 = require("../controllers/certificate.controller");
const router = (0, express_1.Router)();
router.post('/issue', certificate_controller_1.issueCertificate);
router.get('/verify/:hash', certificate_controller_1.verifyCertificate);
exports.default = router;
