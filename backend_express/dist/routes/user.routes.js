"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
// authentication removed for simplicity
const router = (0, express_1.Router)();
router.get('/', user_controller_1.getAllUsers);
router.get('/:id', user_controller_1.getUserById);
router.patch('/:id', user_controller_1.updateUser);
router.patch('/:id/role', user_controller_1.updateRole);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
