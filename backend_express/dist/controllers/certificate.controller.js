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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCertificate = exports.issueCertificate = void 0;
const mongodb_1 = require("mongodb");
const crypto_1 = __importDefault(require("crypto"));
const mongodb_2 = require("../utils/mongodb");
const blockchain_1 = require("../utils/blockchain");
const issueCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.body;
    try {
        if (!mongodb_1.ObjectId.isValid(userId) || !mongodb_1.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid user or course ID' });
        }
        // Generate content hash (simplified for demo)
        const content = JSON.stringify({ userId, courseId, date: new Date().toISOString() });
        const hash = crypto_1.default.createHash('sha256').update(content).digest('hex');
        const uniqueId = 'CERT-' + crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
        const certificatesCollection = yield (0, mongodb_2.getCollection)('Certificate');
        const certData = (0, mongodb_2.prepareDocument)({
            userId: new mongodb_1.ObjectId(userId),
            courseId: new mongodb_1.ObjectId(courseId),
            hash,
            uniqueId,
            status: 'ISSUED',
            txHash: null,
            blockNumber: null
        });
        const result = yield certificatesCollection.insertOne(certData);
        // Store certificate hash on blockchain
        let finalCertData = Object.assign({}, certData);
        try {
            const blockchainResult = yield (0, blockchain_1.storeCertificateOnBlockchain)(certData.uniqueId, hash);
            if (blockchainResult) {
                // Update certificate with blockchain transaction details
                yield certificatesCollection.updateOne({ _id: result.insertedId }, {
                    $set: {
                        txHash: blockchainResult.txHash,
                        blockNumber: blockchainResult.blockNumber
                    }
                });
                // Update certData for response
                finalCertData.txHash = blockchainResult.txHash;
                finalCertData.blockNumber = blockchainResult.blockNumber;
            }
        }
        catch (blockchainError) {
            // Log error but don't fail the request - certificate is still created in DB
            console.error('Blockchain transaction failed:', blockchainError);
        }
        res.status(201).json(Object.assign({ id: result.insertedId.toString() }, finalCertData));
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.issueCertificate = issueCertificate;
const verifyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    try {
        const certificatesCollection = yield (0, mongodb_2.getCollection)('Certificate');
        const cert = yield certificatesCollection.findOne({ hash });
        if (!cert)
            return res.status(404).json({ valid: false });
        // Verify on blockchain if certificate has blockchain data
        let blockchainVerified = false;
        if (cert.txHash && cert.uniqueId) {
            try {
                blockchainVerified = yield (0, blockchain_1.verifyCertificateOnBlockchain)(cert.uniqueId, cert.hash);
            }
            catch (blockchainError) {
                console.error('Blockchain verification error:', blockchainError);
                // Continue even if blockchain verification fails
            }
        }
        res.json({
            valid: true,
            certificate: (0, mongodb_2.formatDoc)(cert),
            blockchainVerified: blockchainVerified
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.verifyCertificate = verifyCertificate;
