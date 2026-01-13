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
exports.getDB = getDB;
exports.getCollection = getCollection;
exports.prepareDocument = prepareDocument;
exports.prepareUpdate = prepareUpdate;
exports.formatDoc = formatDoc;
const mongodb_1 = require("mongodb");
const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';
let dbInstance;
function getDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dbInstance) {
            const client = new mongodb_1.MongoClient(MONGODB_URL);
            yield client.connect();
            dbInstance = client.db();
        }
        return dbInstance;
    });
}
function getCollection(collectionName) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getDB();
        return db.collection(collectionName);
    });
}
// Helper to create documents with proper timestamps
function prepareDocument(data) {
    return Object.assign(Object.assign({}, data), { createdAt: new Date(), updatedAt: new Date() });
}
// Helper to update timestamps
function prepareUpdate(data) {
    return Object.assign(Object.assign({}, data), { updatedAt: new Date() });
}
// Convert MongoDB ObjectId to string for API responses
function formatDoc(doc) {
    if (!doc)
        return null;
    if (doc._id instanceof mongodb_1.ObjectId) {
        doc.id = doc._id.toString();
        delete doc._id;
    }
    return doc;
}
