const { MongoClient } = require('mongodb');

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';

async function clearUsers() {
    const client = new MongoClient(MONGODB_URL);
    try {
        await client.connect();
        const db = client.db();
        const res = await db.collection('User').deleteMany({});
        console.log('Cleared Users:', res.deletedCount);
    } catch (e) {
        console.error('Failed to clear users:', e);
    } finally {
        await client.close();
    }
}

clearUsers();
