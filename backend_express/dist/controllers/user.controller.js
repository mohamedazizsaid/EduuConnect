"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateRole = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../utils/mongodb");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = yield (0, mongodb_2.getCollection)('User');
        const users = yield usersCollection.find({}).toArray();
        res.json(users.map(u => (0, mongodb_2.formatDoc)(Object.assign(Object.assign({}, u), { password: undefined // Don't return passwords
         }))));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const usersCollection = yield (0, mongodb_2.getCollection)('User');
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        delete user.password;
        res.json((0, mongodb_2.formatDoc)(user));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const usersCollection = yield (0, mongodb_2.getCollection)('User');
        const updateData = (0, mongodb_2.prepareUpdate)({ name, email });
        const result = yield usersCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result || !result.value) {
            return res.status(404).json({ error: 'User not found' });
        }
        delete result.value.password;
        res.json((0, mongodb_2.formatDoc)(result.value));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.updateUser = updateUser;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const usersCollection = yield (0, mongodb_2.getCollection)('User');
        const updateData = (0, mongodb_2.prepareUpdate)({ role });
        const result = yield usersCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result || !result.value) {
            return res.status(404).json({ error: 'User not found' });
        }
        delete result.value.password;
        res.json((0, mongodb_2.formatDoc)(result.value));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.updateRole = updateRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const usersCollection = yield (0, mongodb_2.getCollection)('User');
        const result = yield usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).end();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.deleteUser = deleteUser;
