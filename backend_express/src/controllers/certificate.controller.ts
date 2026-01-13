import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { getCollection, formatDoc, prepareDocument } from '../utils/mongodb';
import { storeCertificateOnBlockchain, verifyCertificateOnBlockchain } from '../utils/blockchain';
import { broadcastNotification } from '../utils/websocket';

export const getCertificates = async (req: Request, res: Response) => {
    try {
        const certificatesCollection = await getCollection('Certificate');
        // Optional: Filter by userId if provided in query
        const query = req.query.userId ? { userId: new ObjectId(req.query.userId as string) } : {};

        const certificates = await certificatesCollection.find(query).toArray();
        res.json(certificates.map(formatDoc));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const issueCertificate = async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    try {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid user or course ID' });
        }

        // Generate content hash (simplified for demo)
        const content = JSON.stringify({ userId, courseId, date: new Date().toISOString() });
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const uniqueId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        const certificatesCollection = await getCollection('Certificate');
        const certData = prepareDocument({
            userId: new ObjectId(userId),
            courseId: new ObjectId(courseId),
            hash,
            uniqueId,
            status: 'ISSUED',
            txHash: null,
            blockNumber: null
        });

        const result = await certificatesCollection.insertOne(certData);

        // Notify user that certificate has been created (DB only)
        try {
            const createdNotif = {
                id: result.insertedId.toString(),
                uniqueId: certData.uniqueId,
                status: certData.status,
                issuedAt: certData.createdAt,
                userId: userId,
                courseId: courseId
            };
            broadcastNotification(userId, {
                type: 'CERT_CREATED',
                message: 'Votre certificat a été créé (en attente dAncrage blockchain)',
                certificate: createdNotif
            });
        } catch (notifyErr) {
            console.error('Failed to broadcast creation notification:', notifyErr);
        }

        // Store certificate hash on blockchain
        let finalCertData: any = { ...certData };
        try {
            const blockchainResult = await storeCertificateOnBlockchain(certData.uniqueId, hash);

            if (blockchainResult) {
                // Update certificate with blockchain transaction details
                await certificatesCollection.updateOne(
                    { _id: result.insertedId },
                    {
                        $set: {
                            txHash: blockchainResult.txHash,
                            blockNumber: blockchainResult.blockNumber
                        }
                    }
                );

                // Update certData for response
                finalCertData.txHash = blockchainResult.txHash;
                finalCertData.blockNumber = blockchainResult.blockNumber;

                // Notify user that certificate anchoring succeeded
                try {
                    const anchoredNotif = {
                        id: result.insertedId.toString(),
                        uniqueId: certData.uniqueId,
                        status: certData.status,
                        issuedAt: certData.createdAt,
                        userId: userId,
                        courseId: courseId,
                        txHash: blockchainResult.txHash,
                        blockNumber: blockchainResult.blockNumber
                    };
                    broadcastNotification(userId, {
                        type: 'CERT_ANCHORED',
                        message: 'Votre certificat a été ancré sur la blockchain',
                        txHash: blockchainResult.txHash,
                        blockNumber: blockchainResult.blockNumber,
                        certificate: anchoredNotif
                    });
                } catch (notifyErr) {
                    console.error('Failed to broadcast anchoring notification:', notifyErr);
                }
            }
        } catch (blockchainError: any) {
            // Log error but don't fail the request - certificate is still created in DB
            console.error('Blockchain transaction failed:', blockchainError);
        }

        // Build a clean API response with expected fields
        const responseCert = {
            id: result.insertedId.toString(),
            uniqueId: certData.uniqueId,
            hash: certData.hash,
            txHash: finalCertData.txHash || null,
            status: certData.status,
            issuedAt: certData.createdAt,
            userId: userId,
            courseId: courseId,
            blockNumber: finalCertData.blockNumber || null
        };

        res.status(201).json(responseCert);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const verifyCertificate = async (req: Request, res: Response) => {
    const { id } = req.params; // id can be hash or uniqueId

    try {
        const certificatesCollection = await getCollection('Certificate');
        const cert = await certificatesCollection.findOne({ $or: [{ hash: id }, { uniqueId: id }] });
        if (!cert) return res.status(404).json({ valid: false });

        // Verify on blockchain if certificate has blockchain data
        let blockchainVerified = false;
        if (cert.txHash && cert.uniqueId) {
            try {
                blockchainVerified = await verifyCertificateOnBlockchain(cert.uniqueId, cert.hash);
            } catch (blockchainError: any) {
                console.error('Blockchain verification error:', blockchainError);
                // Continue even if blockchain verification fails
            }
        }

        res.json({
            valid: true,
            certificate: formatDoc(cert),
            blockchainVerified: blockchainVerified
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
