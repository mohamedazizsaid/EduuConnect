import { ethers, Contract, JsonRpcProvider, Wallet } from 'ethers';

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
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e';

// Instance singleton du contrat
let contractInstance: Contract | null = null;

/**
 * Initialise et retourne l'instance du contrat blockchain
 */
function getContract(): Contract | null {
    if (!CONTRACT_ADDRESS) {
        console.warn('BLOCKCHAIN_CONTRACT_ADDRESS not configured. Blockchain features disabled.');
        return null;
    }

    if (contractInstance) {
        return contractInstance;
    }

    try {
        const provider = new JsonRpcProvider(BLOCKCHAIN_RPC_URL);
        
        let signer: Wallet | JsonRpcProvider = provider;
        if (PRIVATE_KEY) {
            signer = new Wallet(PRIVATE_KEY, provider);
        }

        contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return contractInstance;
    } catch (error) {
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
export async function storeCertificateOnBlockchain(
    certId: string,
    hashStr: string
): Promise<{ txHash: string; blockNumber: number } | null> {
    const contract = getContract();
    
    if (!contract) {
        console.warn('Blockchain contract not available. Skipping blockchain storage.');
        return null;
    }

    try {
        // Appeler la fonction storeCertificateHash
        const tx = await contract.storeCertificateHash(certId, hashStr);
        
        // Attendre la confirmation de la transaction
        const receipt = await tx.wait();
        
        if (!receipt) {
            console.error('Transaction receipt is null');
            return null;
        }

        return {
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    } catch (error: any) {
        console.error('Failed to store certificate on blockchain:', error);
        // Ne pas throw l'erreur pour permettre au certificat d'être créé en DB même si blockchain échoue
        return null;
    }
}

/**
 * Vérifie un certificat sur la blockchain
 * @param certId ID unique du certificat
 * @param hashStr Hash du certificat en string
 * @returns true si le certificat est valide sur la blockchain, false sinon
 */
export async function verifyCertificateOnBlockchain(
    certId: string,
    hashStr: string
): Promise<boolean> {
    const contract = getContract();
    
    if (!contract) {
        console.warn('Blockchain contract not available. Skipping blockchain verification.');
        return false;
    }

    try {
        const isValid = await contract.verify(certId, hashStr);
        return isValid;
    } catch (error: any) {
        console.error('Failed to verify certificate on blockchain:', error);
        return false;
    }
}

/**
 * Vérifie si le service blockchain est configuré et disponible
 * @returns true si le service blockchain est disponible
 */
export function isBlockchainAvailable(): boolean {
    return !!CONTRACT_ADDRESS && !!getContract();
}
