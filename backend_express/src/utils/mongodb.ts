import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';
let dbInstance: Db;

export async function getDB(): Promise<Db> {
    if (!dbInstance) {
        const client = new MongoClient(MONGODB_URL);
        await client.connect();
        dbInstance = client.db();
    }
    return dbInstance;
}

export async function getCollection(collectionName: string): Promise<Collection> {
    const db = await getDB();
    return db.collection(collectionName);
}

// Helper to create documents with proper timestamps
export function prepareDocument<T extends Record<string, any>>(data: T): T & { createdAt: Date; updatedAt: Date } {
    return {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

// Helper to update timestamps
export function prepareUpdate<T extends Record<string, any>>(data: T): T & { updatedAt: Date } {
    return {
        ...data,
        updatedAt: new Date(),
    };
}

// Convert MongoDB ObjectId to string for API responses
export function formatDoc(doc: any): any {
    if (!doc) return null;

    // Convert _id to id
    if (doc._id instanceof ObjectId) {
        doc.id = doc._id.toString();
        delete doc._id;
    }

    // Convert all other ObjectId fields to strings
    for (const key in doc) {
        if (doc[key] instanceof ObjectId) {
            doc[key] = doc[key].toString();
        } else if (Array.isArray(doc[key])) {
            // Handle arrays of ObjectIds
            doc[key] = doc[key].map((item: any) =>
                item instanceof ObjectId ? item.toString() : item
            );
        }
    }

    return doc;
}
