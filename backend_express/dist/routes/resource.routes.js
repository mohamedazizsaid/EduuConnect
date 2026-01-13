"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resource_controller_1 = require("../controllers/resource.controller");
// authentication removed for simplicity
const router = (0, express_1.Router)();
router.post('/upload-init', resource_controller_1.initUpload);
router.post('/upload-complete', resource_controller_1.completeUpload);
router.get('/', resource_controller_1.getAllResources);
router.get('/:id', resource_controller_1.getResourceById);
router.delete('/:id', resource_controller_1.deleteResource);
exports.default = router;
