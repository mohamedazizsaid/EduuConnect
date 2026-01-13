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
exports.storeCertificateOnBlockchain = storeCertificateOnBlockchain;
exports.verifyCertificateOnBlockchain = verifyCertificateOnBlockchain;
exports.isBlockchainAvailable = isBlockchainAvailable;
const ethers_1 = require("ethers");
// ABI du contrat EduConnectCertificates
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "certId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "hashStr",
                "type": "string"
            }
        ],
        "name": "storeCertificateHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "certId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "hashStr",
                "type": "string"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
// Configuration blockchain depuis les variables d'environnement
const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || '';
// Instance singleton du contrat
let contractInstance = null;
/**
 * Initialise et retourne l'instance du contrat blockchain
 */
function getContract() {
    if (!CONTRACT_ADDRESS) {
        console.warn('BLOCKCHAIN_CONTRACT_ADDRESS not configured. Blockchain features disabled.');
        return null;
    }
    if (contractInstance) {
        return contractInstance;
    }
    try {
        const provider = new ethers_1.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
        let signer = provider;
        if (PRIVATE_KEY) {
            signer = new ethers_1.Wallet(PRIVATE_KEY, provider);
        }
        contractInstance = new ethers_1.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return contractInstance;
    }
    catch (error) {
        console.error('Failed to initialize blockchain contract:', error);
        return null;
    }
}
/**
 * Stocke un hash de certificat sur la blockchain
 * @param certId ID unique du certificat
 * @param hashStr Hash du certificat en string
 * @returns Transaction receipt avec txHash et blockNumber, ou null en cas d'erreur
 */
function storeCertificateOnBlockchain(certId, hashStr) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = getContract();
        if (!contract) {
            console.warn('Blockchain contract not available. Skipping blockchain storage.');
            return null;
        }
        try {
            // Appeler la fonction storeCertificateHash
            const tx = yield contract.storeCertificateHash(certId, hashStr);
            // Attendre la confirmation de la transaction
            const receipt = yield tx.wait();
            if (!receipt) {
                console.error('Transaction receipt is null');
                return null;
            }
            return {
                txHash: receipt.hash,
                blockNumber: receipt.blockNumber
            };
        }
        catch (error) {
            console.error('Failed to store certificate on blockchain:', error);
            // Ne pas throw l'erreur pour permettre au certificat d'être créé en DB même si blockchain échoue
            return null;
        }
    });
}
/**
 * Vérifie un certificat sur la blockchain
 * @param certId ID unique du certificat
 * @param hashStr Hash du certificat en string
 * @returns true si le certificat est valide sur la blockchain, false sinon
 */
function verifyCertificateOnBlockchain(certId, hashStr) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = getContract();
        if (!contract) {
            console.warn('Blockchain contract not available. Skipping blockchain verification.');
            return false;
        }
        try {
            const isValid = yield contract.verify(certId, hashStr);
            return isValid;
        }
        catch (error) {
            console.error('Failed to verify certificate on blockchain:', error);
            return false;
        }
    });
}
/**
 * Vérifie si le service blockchain est configuré et disponible
 * @returns true si le service blockchain est disponible
 */
function isBlockchainAvailable() {
    return !!CONTRACT_ADDRESS && !!getContract();
}
