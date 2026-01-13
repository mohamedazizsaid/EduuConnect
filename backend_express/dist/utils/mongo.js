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
exports.closeDB = exports.getDb = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';
let client = null;
let db = null;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (db)
        return db;
    client = new mongodb_1.MongoClient(MONGODB_URL);
    yield client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    return db;
});
exports.connectDB = connectDB;
const getDb = () => {
    if (!db)
        throw new Error('Database not initialized. Call connectDB() first.');
    return db;
};
exports.getDb = getDb;
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (client)
        yield client.close();
    client = null;
    db = null;
});
exports.closeDB = closeDB;
exports.default = { connectDB: exports.connectDB, getDb: exports.getDb, closeDB: exports.closeDB };
